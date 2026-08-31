function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function signatureMarkup(value, label) {
  if (!value) return `<div class="signature">${label}: Not provided</div>`;
  if (String(value).startsWith("data:image")) {
    return `<div class="signature"><strong>${label}</strong><br><img src="${value}" alt="${label}"></div>`;
  }
  return `<div class="signature"><strong>${label}</strong><br><a href="${escapeHtml(value)}">View signature</a></div>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const formData = req.body || {};
    const emailSent = await sendEmail({
      to: "wholesoulyork@gmail.com",
      subject: "New Client Intake Form - WholeSoul Wellness",
      html: buildEmailContent(formData),
      from: "WholeSoul Wellness <noreply@wholesoulyork.com>"
    });

    if (!emailSent) throw new Error("Failed to send email");

    return res.status(200).json({
      success: true,
      message: "Form submitted successfully"
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit form. Please try again."
    });
  }
}

function buildEmailContent(data) {
  const checked = (key, label) => data[key] ? `✓ ${label}` : "";
  const restrictions = [
    checked("Pregnant", "Pregnant"),
    checked("Pacemaker", "Pacemaker"),
    checked("Acute Infection", "Acute Infection"),
    checked("CHF", "Congestive Heart Failure"),
    checked("Immunosuppressants", "Immunosuppressants")
  ].filter(Boolean).join("<br>") || "None selected";

  const diet = [
    checked("Vegan", "Vegan"),
    checked("Vegetarian", "Vegetarian"),
    checked("Raw Diet", "Raw Diet"),
    checked("Pescatarian", "Pescatarian"),
    checked("Keto", "Low Carb/Keto"),
    data["Other Diet"] ? `✓ Other: ${escapeHtml(data["Other Diet"])}` : ""
  ].filter(Boolean).join("<br>") || "None selected";

  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 800px; margin: 0 auto; padding: 20px; }
      h2 { color: #2c5f2d; border-bottom: 2px solid #2c5f2d; padding-bottom: 10px; }
      h3 { color: #4a7c4e; margin-top: 25px; }
      .field { margin: 10px 0; }
      .label { font-weight: bold; color: #555; }
      .signature { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
      .signature img { max-width: 300px; height: auto; border: 1px solid #ddd; background: #fff; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>New Client Intake Form Submission</h2>
      <h3>Personal Information</h3>
      <div class="field"><span class="label">Name:</span> ${escapeHtml(data["First Name"])} ${escapeHtml(data["Last Name"])}</div>
      <div class="field"><span class="label">Date of Birth:</span> ${escapeHtml(data["DOB"])}</div>
      <div class="field"><span class="label">Height:</span> ${escapeHtml(data["Height"])}</div>
      <div class="field"><span class="label">Weight:</span> ${escapeHtml(data["Weight"])}</div>
      <div class="field"><span class="label">Address:</span> ${escapeHtml(data["Address"])}, ${escapeHtml(data["City"])}, ${escapeHtml(data["State"])} ${escapeHtml(data["ZIP"])}</div>
      <div class="field"><span class="label">Cell Phone:</span> ${escapeHtml(data["Cell Phone"])}</div>
      <div class="field"><span class="label">Home Phone:</span> ${escapeHtml(data["Home Phone"] || "N/A")}</div>
      <div class="field"><span class="label">Email:</span> ${escapeHtml(data["Email"])}</div>
      <h3>Emergency Contact</h3>
      <div class="field"><span class="label">Name:</span> ${escapeHtml(data["Emergency Name"])}</div>
      <div class="field"><span class="label">Phone:</span> ${escapeHtml(data["Emergency Phone"])}</div>
      <div class="field"><span class="label">Relationship:</span> ${escapeHtml(data["Emergency Relationship"])}</div>
      <h3>Restrictions</h3>
      <div class="field">${restrictions}</div>
      <h3>Health History</h3>
      <div class="field"><span class="label">Recent Surgery:</span> ${escapeHtml(data["Recent Surgery"] || "N/A")}</div>
      <div class="field"><span class="label">Lymphedema:</span> ${escapeHtml(data["Lymphedema"] || "N/A")}</div>
      <div class="field"><span class="label">Other Surgery:</span> ${escapeHtml(data["Other Surgery"] || "N/A")}</div>
      <div class="field"><span class="label">Lymph Nodes Removed:</span> ${escapeHtml(data["Lymph Nodes"] || "N/A")}</div>
      <div class="field"><span class="label">Other Medical Info:</span> ${escapeHtml(data["Other Medical"] || "N/A")}</div>
      <div class="field"><span class="label">Immunosuppressants:</span> ${escapeHtml(data["Immuno-suppressants"] || "N/A")}</div>
      <div class="field"><span class="label">Allergies:</span> ${escapeHtml(data["Allergies"] || "N/A")}</div>
      <div class="field"><span class="label">Healthcare Provider:</span> ${escapeHtml(data["Provider"] || "N/A")}</div>
      <div class="field"><span class="label">Current Medications:</span> ${escapeHtml(data["Medications"] || "N/A")}</div>
      <h3>Dietary Style</h3>
      <div class="field">${diet}</div>
      <h3>Scales</h3>
      <div class="field"><span class="label">Stress Level:</span> ${escapeHtml(data["Stress"] || "N/A")}/10 - ${escapeHtml(data["Stress Type"] || "")}</div>
      <div class="field"><span class="label">Pain Level:</span> ${escapeHtml(data["Pain"] || "N/A")}/10 - ${escapeHtml(data["Pain Location"] || "")}</div>
      <div class="field"><span class="label">Energy Level:</span> ${escapeHtml(data["Energy"] || "N/A")}/10</div>
      <h3>Signatures</h3>
      ${signatureMarkup(data["Client Signature Drawn"], "Client Signature")}
      <div class="signature"><strong>Privacy Acknowledgement</strong><br>Client Name: ${escapeHtml(data["Client Name Inline"])}<br>Date: ${escapeHtml(data["Privacy Date"])}</div>
      ${signatureMarkup(data["Privacy Signature Drawn"], "Privacy Signature")}
      <div class="signature"><strong>Waiver</strong><br>Signed: ${escapeHtml(data["Waiver Month"])} ${escapeHtml(data["Waiver Day"])}, 20${escapeHtml(data["Waiver Year"])}<br>Printed Name: ${escapeHtml(data["Waiver Name"])}</div>
      ${signatureMarkup(data["Waiver Signature Drawn"], "Waiver Signature")}
      <p style="color:#888;font-size:12px;">Submitted via WholeSoul Wellness website</p>
    </div>
  </body>
  </html>`;
}

async function sendEmail({ to, subject, html, from }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from, to: [to], subject, html })
    });
    if (!response.ok) {
      console.error("Resend API error:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
