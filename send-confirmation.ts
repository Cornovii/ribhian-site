// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { first_name, last_name, email, hero_selected, token } = await req.json();

    if (!first_name || !last_name || !email || !hero_selected || !token) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const verifyUrl = `https://heroesofribhus.com/unmatched/verify.html?token=${token}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Tournament Registration</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;color:#e8e0d0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#111111;border-bottom:2px solid #c9973a;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9973a;">Ribhian Games LLC</p>
              <h1 style="margin:8px 0 0;font-size:22px;letter-spacing:0.08em;text-transform:uppercase;color:#e8e0d0;">Unmatched Tournament</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(232,224,208,0.55);">Dire Consequences Gaming Convention &middot; November 7, 2026</p>
            </td>
          </tr>

          <!-- Hero Pending Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(201,151,58,0.18),rgba(201,151,58,0.06));border:1px solid rgba(201,151,58,0.4);padding:24px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c9973a;">Hero Selection Pending</p>
              <p style="margin:10px 0 0;font-size:26px;color:#e0b85a;font-style:italic;">${hero_selected}</p>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(232,224,208,0.6);">Selected by ${first_name} ${last_name}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1a1a1a;padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                ${first_name}, you're almost registered! Click the button below to confirm your email address and lock in <strong style="color:#e0b85a;">${hero_selected}</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:13px;color:rgba(232,224,208,0.6);line-height:1.6;">
                Your hero is being held for <strong style="color:#e8e0d0;">24 hours</strong>. If you do not verify within that time, your selection will be released and the hero will become available to other players.
              </p>

              <!-- Verify Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${verifyUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#c9973a,#e0b85a);color:#0a0a0a;font-family:Georgia,serif;font-size:1rem;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:6px;">
                      ⚔ Confirm My Registration
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:12px;color:rgba(232,224,208,0.4);text-align:center;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:11px;color:rgba(232,224,208,0.35);text-align:center;word-break:break-all;">
                ${verifyUrl}
              </p>

              <!-- Event Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(201,151,58,0.18);border-radius:6px;margin:0 0 20px;">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#c9973a;">Event Details</p>
                    <p style="margin:10px 0 4px;font-size:13px;color:rgba(232,224,208,0.55);">&#128197; &nbsp;November 7, 2026 &nbsp;&middot;&nbsp; 2:00 PM &ndash; 6:00 PM</p>
                    <p style="margin:4px 0;font-size:13px;color:rgba(232,224,208,0.55);">&#128205; &nbsp;Dire Consequences Gaming Convention</p>
                    <p style="margin:4px 0;font-size:13px;color:rgba(232,224,208,0.55);">&#127942; &nbsp;16 Players &nbsp;&middot;&nbsp; Swiss Format &nbsp;&middot;&nbsp; No Elimination</p>
                  </td>
                </tr>
              </table>

              <!-- Prize -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(201,151,58,0.1),rgba(201,151,58,0.03));border:1px solid #c9973a;border-radius:6px;margin:0 0 20px;">
                <tr>
                  <td style="padding:16px 22px;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#c9973a;">&#127942; &nbsp;Tournament Prize</p>
                    <p style="margin:8px 0 0;font-size:14px;color:#e8e0d0;">Brand new sealed <em>Unmatched: Adventures &mdash; Tales to Amaze</em> set</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(232,224,208,0.6);">
                If you did not register for this tournament, you can safely ignore this email. 
                Questions? Contact us at <a href="mailto:ribhiangames@gmail.com" style="color:#c9973a;">ribhiangames@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111111;border-top:1px solid rgba(201,151,58,0.18);padding:18px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.1em;color:rgba(232,224,208,0.35);">
                Ribhian Games LLC &nbsp;&middot;&nbsp; Dire Consequences 2026 &nbsp;&middot;&nbsp; Unmatched Tournament
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(232,224,208,0.25);">
                This email was sent to ${email} because you registered for the tournament.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@heroesofribhus.com",
        to: email,
        reply_to: "ribhiangames@gmail.com",
        subject: `⚔ Confirm Your Hero — ${hero_selected} | Unmatched Tournament`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data }, { status: 500 });
    return Response.json({ success: true, id: data.id }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
