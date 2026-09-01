'use server'

import { revalidatePath } from 'next/cache'
import { requireTeacher } from '@/lib/auth/require-teacher'
import { createAdminClient } from '@/lib/supabase/admin'

type StudentInput = {
  email: string
  fullName: string
  grupo: 1 | 2
  ccaa: string
  startDate?: string
}

// Generar contraseña aleatoria segura
function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

function translateAuthError(message: string): string {
  if (message.toLowerCase().includes('already been registered') || message.toLowerCase().includes('already registered')) {
    return 'Ya existe una cuenta con ese email.'
  }
  if (message.toLowerCase().includes('invalid') && message.toLowerCase().includes('email')) {
    return 'El email no es válido.'
  }
  return message
}

export async function createStudent(input: StudentInput) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const { email, fullName, grupo, ccaa, startDate } = input
  const admin = createAdminClient()
  const password = generateRandomPassword()

  // Crear usuario en auth
  const { data, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (createError || !data.user) {
    return { error: 'No se pudo crear el usuario. Verifica que el email no esté registrado.' }
  }

  const userId = data.user.id

  // Actualizar perfil
  const { supabase } = await requireTeacher()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: fullName, grupo, ccaa })
    .eq('id', userId)

  if (updateError) return { error: updateError.message }

  // Auto-asignar Tema 50 y 54 (Semana 1 y 2)
  try {
    const { data: temas, error: temasError } = await admin
      .from('topics')
      .select('id, code')
      .in('code', ['TEMA-50', 'TEMA-54'])
      .limit(10)

    if (temasError) {
      console.error('Error fetching topics:', temasError)
      return { error: 'Error al obtener los temas por defecto.' }
    }

    if (!temas || temas.length === 0) {
      console.warn('No topics found with codes TEMA-50, TEMA-54')
      return { error: 'Los temas TEMA-50 y TEMA-54 no existen en la base de datos.' }
    }

    const tema50 = temas.find(t => t.code === 'TEMA-50')
    const tema54 = temas.find(t => t.code === 'TEMA-54')

    if (!tema50 || !tema54) {
      console.warn('Missing required topics. Tema50:', !!tema50, 'Tema54:', !!tema54)
      return { error: 'Falta al menos uno de los temas por defecto (TEMA-50 o TEMA-54).' }
    }

    // Crear study plan
    const { data: studyPlan, error: studyPlanError } = await admin
      .from('study_plans')
      .insert({ student_id: userId, is_active: true })
      .select('id')
      .single()

    if (studyPlanError || !studyPlan) {
      console.error('Error creating study plan:', studyPlanError)
      return { error: 'No se pudo crear el plan de estudio.' }
    }

    // Asignar temas (Tema 50 semana 1, Tema 54 semana 2)
    const week1Start = startDate ? new Date(startDate) : new Date()
    const week2Start = new Date(week1Start)
    week2Start.setDate(week2Start.getDate() + 7)

    const { error: topicsError } = await admin
      .from('study_plan_topics')
      .insert([
        { study_plan_id: studyPlan.id, topic_id: tema50.id, order_index: 1, scheduled_date: week1Start.toISOString().split('T')[0] },
        { study_plan_id: studyPlan.id, topic_id: tema54.id, order_index: 2, scheduled_date: week2Start.toISOString().split('T')[0] },
      ])

    if (topicsError) {
      console.error('Error assigning topics:', topicsError)
      return { error: 'No se pudo asignar los temas al plan de estudio.' }
    }
  } catch (err) {
    console.error('Unexpected error in topic assignment:', err)
    return { error: 'Error inesperado al asignar los temas.' }
  }

  revalidatePath('/teacher/students')
  return {
    error: null,
    credentials: {
      email,
      password,
      userId
    }
  }
}

export async function inviteStudent(input: StudentInput) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const { email, fullName, grupo, ccaa } = input
  const admin = createAdminClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/set-password`,
    data: { full_name: fullName },
  })
  if (inviteError || !data.user) {
    return { error: translateAuthError(inviteError?.message ?? 'No se pudo invitar al alumno.') }
  }

  const { supabase } = await requireTeacher()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: fullName, grupo, ccaa })
    .eq('id', data.user.id)

  if (updateError) return { error: updateError.message }

  // Auto-asignar Tema 50 y 54 al nuevo alumno
  const userId = data.user.id
  const adminClient = createAdminClient()

  // Obtener los IDs de Tema 50 y 54
  const { data: temas, error: temasError } = await adminClient
    .from('topics')
    .select('id, code')
    .in('code', ['TEMA-50', 'TEMA-54'])

  if (temasError || !temas || temas.length < 2) {
    return { error: 'No se pudo obtener los temas por defecto.' }
  }

  const tema50 = temas.find(t => t.code === 'TEMA-50')
  const tema54 = temas.find(t => t.code === 'TEMA-54')

  if (!tema50 || !tema54) {
    return { error: 'No se encontraron los temas por defecto.' }
  }

  // Crear un study_plan activo para el alumno
  const { data: studyPlan, error: studyPlanError } = await adminClient
    .from('study_plans')
    .insert({ student_id: userId, is_active: true })
    .select('id')
    .single()

  if (studyPlanError || !studyPlan) {
    return { error: 'No se pudo crear el plan de estudio.' }
  }

  // Asignar Tema 50 (order_index 1) y Tema 54 (order_index 2)
  const { error: topicsError } = await adminClient
    .from('study_plan_topics')
    .insert([
      { study_plan_id: studyPlan.id, topic_id: tema50.id, order_index: 1 },
      { study_plan_id: studyPlan.id, topic_id: tema54.id, order_index: 2 },
    ])

  if (topicsError) {
    return { error: 'No se pudo asignar los temas al plan.' }
  }

  revalidatePath('/teacher/students')
  return { error: null }
}

export async function updateStudent(
  id: string,
  input: { fullName: string; grupo: 1 | 2 | null; ccaa: string | null; role: 'student' | 'teacher' | 'admin' }
) {
  const { supabase, error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName,
      grupo: input.grupo,
      ccaa: input.ccaa,
      role: input.role,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/teacher/students')
  return { error: null }
}

export async function deleteStudent(id: string) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const admin = createAdminClient()

  // Eliminar datos del alumno (estudio, planes, etc.)
  const { error: studyPlansError } = await admin
    .from('study_plans')
    .delete()
    .eq('student_id', id)

  if (studyPlansError) return { error: 'No se pudo eliminar el plan de estudio del alumno.' }

  // Eliminar usuario de Supabase Auth
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(id)

  if (deleteAuthError) return { error: 'No se pudo eliminar la cuenta del alumno.' }

  revalidatePath('/teacher/students')
  return { error: null }
}
