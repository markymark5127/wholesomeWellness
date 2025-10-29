// Vercel Serverless Function to handle form submissions
// This replaces Web3Forms and sends emails directly

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const formData = req.body;

    // Build email content
    const emailContent = buildEmailContent(formData);

    // Send email using Resend API
    const emailSent = await sendEmail({
      to: 'wholesoulyork@gmail.com',
      subject: 'New Client Intake Form - WholeSoul Wellness',
      html: emailContent,
      from: 'noreply@wholesoulyork.com', // You'll need to set up domain
    });

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Form submitted successfully'
      });
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again.'
    });
  }
}

// Build HTML email content from form data
function buildEmailContent(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h2 { color: #2c5f2d; border-bottom: 2px solid #2c5f2d; padding-bottom: 10px; }
        h3 { color: #4a7c4e; margin-top: 25px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; }
        .signature { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .signature img { max-width: 300px; height: auto; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Client Intake Form Submission</h2>

        <h3>Personal Information</h3>
        <div class="field"><span class="label">Name:</span> <span class="value">${data['First Name']} ${data['Last Name']}</span></div>
        <div class="field"><span class="label">Date of Birth:</span> <span class="value">${data['DOB']}</span></div>
        <div class="field"><span class="label">Height:</span> <span class="value">${data['Height']}</span></div>
        <div class="field"><span class="label">Weight:</span> <span class="value">${data['Weight']}</span></div>
        <div class="field"><span class="label">Address:</span> <span class="value">${data['Address']}, ${data['City']}, ${data['State']} ${data['ZIP']}</span></div>
        <div class="field"><span class="label">Cell Phone:</span> <span class="value">${data['Cell Phone']}</span></div>
        <div class="field"><span class="label">Home Phone:</span> <span class="value">${data['Home Phone'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Email:</span> <span class="value">${data['Email']}</span></div>

        <h3>Emergency Contact</h3>
        <div class="field"><span class="label">Name:</span> <span class="value">${data['Emergency Name']}</span></div>
        <div class="field"><span class="label">Phone:</span> <span class="value">${data['Emergency Phone']}</span></div>
        <div class="field"><span class="label">Relationship:</span> <span class="value">${data['Emergency Relationship']}</span></div>

        <h3>Restrictions</h3>
        <div class="field">
          ${data['Pregnant'] ? '✓ Pregnant' : ''}
          ${data['Pacemaker'] ? '✓ Pacemaker' : ''}
          ${data['Acute Infection'] ? '✓ Acute Infection' : ''}
          ${data['CHF'] ? '✓ Congestive Heart Failure' : ''}
          ${data['Immunosuppressants'] ? '✓ Immunosuppressants' : ''}
          ${!data['Pregnant'] && !data['Pacemaker'] && !data['Acute Infection'] && !data['CHF'] && !data['Immunosuppressants'] ? 'None selected' : ''}
        </div>

        <h3>Health History</h3>
        <div class="field"><span class="label">Recent Surgery:</span> <span class="value">${data['Recent Surgery'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Lymphedema:</span> <span class="value">${data['Lymphedema'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Other Surgery:</span> <span class="value">${data['Other Surgery'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Lymph Nodes Removed:</span> <span class="value">${data['Lymph Nodes'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Other Medical Info:</span> <span class="value">${data['Other Medical'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Immunosuppressants:</span> <span class="value">${data['Immuno-suppressants'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Allergies:</span> <span class="value">${data['Allergies'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Healthcare Provider:</span> <span class="value">${data['Provider'] || 'N/A'}</span></div>
        <div class="field"><span class="label">Current Medications:</span> <span class="value">${data['Medications'] || 'N/A'}</span></div>

        <h3>Dietary Style</h3>
        <div class="field">
          ${data['Vegan'] ? '✓ Vegan' : ''}
          ${data['Vegetarian'] ? '✓ Vegetarian' : ''}
          ${data['Raw Diet'] ? '✓ Raw Diet' : ''}
          ${data['Pescatarian'] ? '✓ Pescatarian' : ''}
          ${data['Keto'] ? '✓ Low Carb/Keto' : ''}
          ${data['Other Diet'] ? '✓ Other: ' + data['Other Diet'] : ''}
        </div>

        <h3>Scales</h3>
        <div class="field"><span class="label">Stress Level:</span> <span class="value">${data['Stress']}/10 - ${data['Stress Type']}</span></div>
        <div class="field"><span class="label">Pain Level:</span> <span class="value">${data['Pain']}/10 - ${data['Pain Location']}</span></div>
        <div class="field"><span class="label">Energy Level:</span> <span class="value">${data['Energy']}/10</span></div>

        <h3>Signatures</h3>

        <div class="signature">
          <strong>Client Signature:</strong><br>
          ${data['Client Signature Drawn'] ? `<a href="${data['Client Signature Drawn']}">View Client Signature</a>` : 'Not provided'}
        </div>

        <div class="signature">
          <strong>Privacy Acknowledgement:</strong><br>
          Client Name: ${data['Client Name Inline']}<br>
          Date: ${data['Privacy Date']}<br>
          ${data['Privacy Signature Drawn'] ? `<a href="${data['Privacy Signature Drawn']}">View Privacy Signature</a>` : 'Not provided'}
        </div>

        <div class="signature">
          <strong>Waiver Signature:</strong><br>
          Signed: ${data['Waiver Month']} ${data['Waiver Day']}, 20${data['Waiver Year']}<br>
          Printed Name: ${data['Waiver Name']}<br>
          ${data['Waiver Signature Drawn'] ? `<a href="${data['Waiver Signature Drawn']}">View Waiver Signature</a>` : 'Not provided'}
        </div>

        <hr style="margin-top: 30px;">
        <p style="color: #888; font-size: 12px;">Submitted via WholeSoul Wellness website</p>
      </div>
    </body>
    </html>
  `;
}

// Send email using Resend API
async function sendEmail({ to, subject, html, from }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
