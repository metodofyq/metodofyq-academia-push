import { createClient } from '@/lib/supabase/server'
import { requireTeacher } from '@/lib/auth/require-teacher'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { error: authError } = await requireTeacher()
  if (authError) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { supabase } = await requireTeacher()

  const { data, error } = await supabase
    .from('topics')
    .select('id, code, title')
    .order('code')

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data || [])
}
