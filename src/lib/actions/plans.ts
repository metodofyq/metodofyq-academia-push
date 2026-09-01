'use server'

import { revalidatePath } from 'next/cache'
import { requireTeacher } from '@/lib/auth/require-teacher'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateStudentPlan(studentId: string, topicIds: string[]) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Obtener el plan activo del estudiante
  const { data: plan, error: planError } = await admin
    .from('study_plans')
    .select('id')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .maybeSingle()

  if (planError) return { error: planError.message }

  if (!plan) {
    // Si no existe plan, crear uno
    const { data: newPlan, error: createError } = await admin
      .from('study_plans')
      .insert({ student_id: studentId, is_active: true })
      .select('id')
      .single()

    if (createError || !newPlan) return { error: 'No se pudo crear el plan' }

    // Asignar temas
    const planTopicsToInsert = topicIds.map((topicId, index) => ({
      study_plan_id: newPlan.id,
      topic_id: topicId,
      order_index: index + 1,
    }))

    if (planTopicsToInsert.length > 0) {
      const { error: insertError } = await admin
        .from('study_plan_topics')
        .insert(planTopicsToInsert)

      if (insertError) return { error: 'No se pudo asignar los temas' }
    }
  } else {
    // Eliminar los temas actuales
    const { error: deleteError } = await admin
      .from('study_plan_topics')
      .delete()
      .eq('study_plan_id', plan.id)

    if (deleteError) return { error: 'No se pudo eliminar los temas anteriores' }

    // Insertar los nuevos temas
    const planTopicsToInsert = topicIds.map((topicId, index) => ({
      study_plan_id: plan.id,
      topic_id: topicId,
      order_index: index + 1,
    }))

    if (planTopicsToInsert.length > 0) {
      const { error: insertError } = await admin
        .from('study_plan_topics')
        .insert(planTopicsToInsert)

      if (insertError) return { error: 'No se pudo asignar los temas' }
    }
  }

  revalidatePath('/teacher/plans')
  return { error: null }
}

export async function addTopicToStudentPlan(studentId: string, topicId: string, scheduledDateOrWeeks: string | number = 0) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Obtener el plan activo del estudiante
  const { data: plan, error: planError } = await admin
    .from('study_plans')
    .select('id, study_plan_topics(order_index)')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single()

  if (planError) return { error: 'No se encontró el plan de estudio del alumno.' }

  if (!plan) return { error: 'El alumno no tiene un plan de estudio activo.' }

  // Obtener el siguiente order_index
  const topics = (plan.study_plan_topics ?? []) as { order_index: number }[]
  const nextOrderIndex = topics.length > 0 ? Math.max(...topics.map(t => t.order_index)) + 1 : 1

  // Calcular la fecha programada
  let scheduledDate: string
  if (typeof scheduledDateOrWeeks === 'string') {
    // Si es una fecha string (ej: "2026-09-15")
    scheduledDate = scheduledDateOrWeeks
  } else {
    // Si es un número de semanas desde hoy
    const date = new Date()
    date.setDate(date.getDate() + scheduledDateOrWeeks * 7)
    scheduledDate = date.toISOString().split('T')[0]
  }

  // Agregar el tema
  const { error: insertError } = await admin
    .from('study_plan_topics')
    .insert({
      study_plan_id: plan.id,
      topic_id: topicId,
      order_index: nextOrderIndex,
      scheduled_date: scheduledDate,
    })

  if (insertError) return { error: 'No se pudo agregar el tema al plan.' }

  revalidatePath('/teacher/students')
  revalidatePath('/teacher/plans')
  return { error: null }
}

export async function removeTopicFromStudentPlan(studentId: string, topicId: string) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Obtener el plan activo
  const { data: plan, error: planError } = await admin
    .from('study_plans')
    .select('id')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single()

  if (planError || !plan) return { error: 'Plan de estudio no encontrado.' }

  // Eliminar el tema
  const { error: deleteError } = await admin
    .from('study_plan_topics')
    .delete()
    .eq('study_plan_id', plan.id)
    .eq('topic_id', topicId)

  if (deleteError) return { error: 'No se pudo eliminar el tema.' }

  revalidatePath('/teacher/plans')
  revalidatePath('/teacher/students')
  return { error: null }
}

export async function updateTopicScheduleDate(
  studentId: string,
  topicId: string,
  scheduledDate: string
) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Obtener el plan activo
  const { data: plan, error: planError } = await admin
    .from('study_plans')
    .select('id')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single()

  if (planError || !plan) return { error: 'Plan de estudio no encontrado.' }

  // Actualizar la fecha
  const { error: updateError } = await admin
    .from('study_plan_topics')
    .update({ scheduled_date: scheduledDate })
    .eq('study_plan_id', plan.id)
    .eq('topic_id', topicId)

  if (updateError) return { error: 'No se pudo actualizar la fecha.' }

  revalidatePath('/teacher/plans')
  return { error: null }
}

export async function reorderStudentPlanTopics(
  studentId: string,
  topics: Array<{ topicId: string; orderIndex: number }>
) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Obtener el plan activo
  const { data: plan, error: planError } = await admin
    .from('study_plans')
    .select('id')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single()

  if (planError || !plan) return { error: 'Plan de estudio no encontrado.' }

  // Actualizar order_index para cada tema
  for (const { topicId, orderIndex } of topics) {
    const { error: updateError } = await admin
      .from('study_plan_topics')
      .update({ order_index: orderIndex })
      .eq('study_plan_id', plan.id)
      .eq('topic_id', topicId)

    if (updateError) return { error: `No se pudo reordenar los temas.` }
  }

  revalidatePath('/teacher/plans')
  return { error: null }
}
