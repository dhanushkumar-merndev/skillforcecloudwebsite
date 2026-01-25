import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('admin_session')?.value;

  if (!sessionId) {
    return new Response(JSON.stringify({ 
      authenticated: false 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify session exists in database
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, email')
    .eq('id', sessionId)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ 
      authenticated: false 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    authenticated: true,
    user: data
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
