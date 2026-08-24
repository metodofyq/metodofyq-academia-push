import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getTopicMediaUrl } from '@/lib/niveles/media'
import { NIVEL_ORDER, isNivelAccesible } from '@/lib/niveles/constants'
import { EstructuraNivel } from '@/components/niveles/estructura-nivel'
import { InfografiaGaleria } from '@/components/niveles/infografia-galeria'
import { DictadoCorrector } from '@/components/niveles/dictado-corrector'
import { FlashcardsSemaforo } from '@/components/niveles/flashcards-semaforo'
import { LegislacionNivel4 } from '@/components/niveles/legislacion-nivel4'
import type { Apartado } from '@/lib/niveles/texto'

interface Props {
  params: Promise<{ topicId: string; nivel: string }>
}

export default async function NivelPage({ params }: Props) {
  const { topicId, nivel: nivelStr } = await params
  const nivel = Number(nivelStr)
  if (!NIVEL_ORDER.includes(nivel as (typeof NIVEL_ORDER)[number])) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: topic }, { data: profile }, { data: progress }, { data: allLevels }] = await Promise.all([
    supabase.from('topics').select('*').eq('id', topicId).single(),
    supabase.from('profiles').select('grupo, ccaa').eq('id', user.id).single(),
    supabase.from('topic_progress').select('current_level').eq('student_id', user.id).eq('topic_id', topicId).maybeSingle(),
    supabase.from('topic_levels').select('*').eq('topic_id', topicId),
  ])

  if (!topic) notFound()

  const currentLevel = progress?.current_level != null ? Number(progress.current_level) : 0
  const incluirNivel4 = profile?.grupo === 2

  if (!isNivelAccesible(nivel, currentLevel)) {
    redirect(`/topics/${topicId}`)
  }

  const levelRow = (levelVal: number) => allLevels?.find((l) => Number(l.level) === levelVal)
  const contentOf = (levelVal: number) => levelRow(levelVal)?.content_json as Record<string, unknown> | null | undefined
  const estructura = contentOf(0)?.estructura as Apartado[] | undefined
  const keywords = contentOf(1)?.keywords as Record<string, string> | undefined
  const nivel2Texto = contentOf(2)?.texto as string | undefined
  const nivel3Texto = contentOf(3)?.texto as string | undefined

  const contenidoNoDisponible = (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-muted-foreground bg-slate-50 border rounded-xl p-4">
        Este nivel todavía no tiene contenido cargado.
      </p>
      <Link href={`/topics/${topicId}`} className="text-sm text-primary hover:underline">
        ← Volver al tema
      </Link>
    </div>
  )

  if (nivel === 0) {
    if (!estructura) return contenidoNoDisponible
    return <EstructuraNivel nivel={0} estructura={estructura} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  if (nivel === 1) {
    if (!estructura || !keywords) return contenidoNoDisponible
    return <EstructuraNivel nivel={1} estructura={estructura} keywords={keywords} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  if (nivel === 0.5) {
    const { data: infografias } = await supabase
      .from('topic_infografias')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index')
    if (!infografias || infografias.length === 0) return contenidoNoDisponible
    const imagenes = infografias.map((i) => ({ label: i.label, url: getTopicMediaUrl(i.storage_path) }))
    return <InfografiaGaleria imagenes={imagenes} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  if (nivel === 2) {
    if (!nivel2Texto) return contenidoNoDisponible
    return <DictadoCorrector nivel={2} texto={nivel2Texto} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  if (nivel === 2.5) {
    if (!nivel2Texto) return contenidoNoDisponible
    return <FlashcardsSemaforo texto={nivel2Texto} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  if (nivel === 3) {
    if (!nivel3Texto) return contenidoNoDisponible
    const { data: n3Images } = await supabase
      .from('topic_n3_images')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index')
    const imagenesAncladas = (n3Images ?? []).map((im) => ({
      anchor: im.anchor_text, caption: im.caption, dibujar: im.dibujar_hint, url: getTopicMediaUrl(im.storage_path),
    }))
    return <DictadoCorrector nivel={3} texto={nivel3Texto} imagenesAncladas={imagenesAncladas} topicId={topicId} studentId={user.id} incluirNivel4={incluirNivel4} />
  }

  // nivel === 4
  const { data: legislacion } = await supabase
    .from('topic_level4_legislacion')
    .select('content_md')
    .eq('topic_id', topicId)
    .eq('ccaa', profile?.ccaa ?? '')
    .maybeSingle()

  return <LegislacionNivel4 grupo={profile?.grupo ?? null} ccaa={profile?.ccaa ?? null} contenido={legislacion?.content_md ?? null} />
}
