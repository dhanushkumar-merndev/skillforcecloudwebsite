import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const submission = {
      full_name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      program: formData.get('program') as string,
      passout_year: formData.get('passout') as string,
      message: formData.get('message') as string || null,
      resume_url: null as string | null,
    };

    // Validate required fields
    if (!submission.full_name || !submission.email || !submission.phone || 
        !submission.program || !submission.passout_year) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle resume file upload
    const resumeFile = formData.get('resume') as File;
    if (resumeFile && resumeFile.size > 0) {
      // Validate file size (5MB limit)
      if (resumeFile.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Resume file size must be less than 5MB' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate file type (PDF only)
      if (resumeFile.type !== 'application/pdf') {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Only PDF files are allowed for resume' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedEmail = submission.email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${sanitizedEmail}_${timestamp}.pdf`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          contentType: 'application/pdf',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to upload resume' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      submission.resume_url = publicUrl;
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submission])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to submit form' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
