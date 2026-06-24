import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function baseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function sendConfirmationEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const firstName = name.split(" ")[0];
  const confirmUrl = `${baseUrl()}/smiq/confirm?token=${token}`;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: "Confirm your Capoeira International response",
    html: `
<!-- confirm email -->
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0e0c09;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e0c09;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#15120d;border:1px solid #2a2318;border-radius:8px;padding:40px;">
        <tr><td style="color:#c8922a;font-size:22px;font-weight:bold;padding-bottom:16px;">
          Capoeira International
        </td></tr>
        <tr><td style="color:#e8dfd0;font-size:17px;padding-bottom:12px;">
          Axé, ${firstName} —
        </td></tr>
        <tr><td style="color:#b8aa94;font-size:15px;line-height:1.6;padding-bottom:28px;">
          Thank you for sharing your experience with the Capoeira community. Please confirm your email address to submit your response.
        </td></tr>
        <tr><td style="padding-bottom:28px;">
          <a href="${confirmUrl}"
             style="display:inline-block;background:#c8922a;color:#0e0c09;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:6px;">
            Confirm my response →
          </a>
        </td></tr>
        <tr><td style="color:#6b5f4e;font-size:13px;line-height:1.5;">
          This link expires in 24 hours. If you didn't fill in the Capoeira International survey, you can safely ignore this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log("[resend] sent", data?.id);
}
