import type { APIRoute } from 'astro';
import { sendToTelegram } from '../../lib/telegram';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    
    const submission = {
      full_name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      program: formData.get('program') as string,
      passout_year: formData.get('passout') as string,
      message: formData.get('message') as string || 'No message provided',
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

    // Prepare Telegram message
    const telegramMessage = `
<b>New Contact Submission</b>
━━━━━━━━━━━━━━━━━━
<b>Name:</b> ${submission.full_name}
<b>Email:</b> ${submission.email}
<b>Phone:</b> ${submission.phone}
<b>Program:</b> ${submission.program}
<b>Passout:</b> ${submission.passout_year}
<b>Message:</b>
${submission.message}
━━━━━━━━━━━━━━━━━━
${"Date:"+new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')} ${"Time:"+new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
    `.trim();

    // Handle resume file
    const resumeFile = formData.get('resume') as File;
    let fileToTelegram = undefined;

    if (resumeFile && resumeFile.size > 0) {
      // Validate
      if (resumeFile.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ success: false, error: 'File too large (>5MB)' }), { status: 400 });
      }
      if (resumeFile.type !== 'application/pdf') {
        return new Response(JSON.stringify({ success: false, error: 'Only PDF allowed' }), { status: 400 });
      }

      fileToTelegram = {
        blob: resumeFile,
        name: `Resume_${submission.full_name.replace(/\s+/g, '_')}.pdf`
      };
    }

    // Send to Telegram
    const sent = await sendToTelegram(telegramMessage, fileToTelegram);

    if (!sent) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to notify via Telegram' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Submission successful' 
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

