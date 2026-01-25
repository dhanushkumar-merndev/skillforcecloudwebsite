import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('admin_session')?.value;

  if (!sessionId) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Not authenticated' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify admin session
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', sessionId)
    .single();

  if (adminError || !admin) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Not authenticated' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch all submissions
  const { data: submissions, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch submissions' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true,
    submissions 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
