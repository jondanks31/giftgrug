import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.redirect(new URL('/cave?error=missing-id', request.url));
  }

  const supabase = await createClient();

  // Update the special sun to mark as remembered
  const { error } = await supabase
    .from('special_suns')
    .update({
      man_remembered: true,
      man_remembered_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.redirect(new URL('/cave?error=update-failed', request.url));
  }

  // Redirect to cave with success message
  return NextResponse.redirect(new URL('/cave?remembered=true', request.url));
}
