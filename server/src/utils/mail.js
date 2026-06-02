import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM || 'CONTRI <onboarding@resend.dev>';

async function sendMail({ to, subject, html }) {
  if (!resend) {
    console.log(`[DEV] Email to ${to} not sent (no RESEND_API_KEY)`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) console.error('Email send failed:', error);
}

export async function sendVerificationEmail(email, name, code) {
  console.log(`[DEV] Verification code for ${email}: ${code}`);
  await sendMail({
    to: email,
    subject: 'Welcome to CONTRI — Verify your email',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to CONTRI, ${name}!</h2>
        <p>Your verification code is:</p>
        <div style="background: #eef2ff; padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">
          ${code}
        </div>
        <p style="color: #6b7280; margin-top: 16px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

export async function sendGroupInviteEmail(email, inviterName, groupName, acceptLink) {
  console.log(`[DEV] Invite email to ${email}: ${inviterName} invited you to "${groupName}"`);
  await sendMail({
    to: email,
    subject: `${inviterName} invited you to "${groupName}" on CONTRI`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">You're invited! 🎉</h2>
        <p><strong>${inviterName}</strong> invited you to join <strong>${groupName}</strong> on CONTRI.</p>
        <p>Click below to accept the invitation:</p>
        <a href="${acceptLink}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Accept Invite
        </a>
        <p style="color: #6b7280; margin-top: 16px;">This invite expires in 7 days.</p>
        <p style="color: #6b7280;">If you don't have a CONTRI account yet, <a href="${process.env.CLIENT_URL || 'http://localhost:5174'}/register" style="color: #4f46e5;">register here</a> first.</p>
      </div>
    `,
  });
}

export async function sendExpenseNotificationEmail(email, userName, groupName, expenseTitle, amount, paidByName, share, type = 'expense') {
  const isSettlement = type === 'settlement';
  console.log(`[DEV] ${isSettlement ? 'Settlement' : 'Expense'} notification to ${email}: ${paidByName} ${isSettlement ? 'settled' : 'added'} in "${groupName}"`);
  await sendMail({
    to: email,
    subject: isSettlement
      ? `Settlement in "${groupName}" on CONTRI`
      : `New expense in "${groupName}" on CONTRI`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">${isSettlement ? '🔄 Settlement' : '💰 New Expense'}</h2>
        <p>Hi ${userName},</p>
        ${isSettlement
          ? `<p><strong>${paidByName}</strong> settled up <strong>₹${amount}</strong> in <strong>${groupName}</strong>.</p>`
          : `
            <p><strong>${paidByName}</strong> added an expense in <strong>${groupName}</strong>:</p>
            <div style="background: #f9fafb; padding: 16px; border-radius: 12px; margin: 12px 0;">
              <p style="font-size: 18px; font-weight: 700; margin: 0 0 4px;">${expenseTitle}</p>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Total: <strong>₹${amount}</strong></p>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Your share: <strong>₹${share}</strong></p>
            </div>
          `
        }
        <p style="color: #6b7280; margin-top: 16px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5174'}/dashboard" style="color: #4f46e5;">View in CONTRI</a>
        </p>
      </div>
    `,
  });
}

export async function sendResetPasswordEmail(email, code) {
  console.log(`[DEV] Password reset code for ${email}: ${code}`);
  await sendMail({
    to: email,
    subject: 'CONTRI — Reset your password',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Reset your password</h2>
        <p>Your reset code is:</p>
        <div style="background: #eef2ff; padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">
          ${code}
        </div>
        <p style="color: #6b7280; margin-top: 16px;">This code expires in 15 minutes.</p>
        <p style="color: #6b7280;">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}
