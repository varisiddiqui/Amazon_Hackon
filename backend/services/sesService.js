import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { awsConfig, isSesConfigured } from "../config/aws.js";

let sesClient = null;

function getClient() {
  if (!isSesConfigured()) {
    throw new Error("AWS SES is not configured. Set AWS_SES_FROM_EMAIL in .env");
  }
  if (!sesClient) {
    sesClient = new SESClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }
  return sesClient;
}

export async function sendEmail({ to, subject, html, text }) {
  const client = getClient();

  await client.send(
    new SendEmailCommand({
      Source: awsConfig.sesFromEmail,
      Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: html ? { Data: html, Charset: "UTF-8" } : undefined,
          Text: { Data: text || subject, Charset: "UTF-8" },
        },
      },
    })
  );

  return { ok: true, to, subject };
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to CampusFlow",
    html: `<h2>Welcome ${user.fullName}!</h2><p>Your CampusFlow account is ready. Explore events, AI assistant, and placement tools.</p>`,
    text: `Welcome ${user.fullName}! Your CampusFlow account is ready.`,
  });
}

export async function sendEventRegistrationEmail(user, event) {
  return sendEmail({
    to: user.email,
    subject: `Registered: ${event.title}`,
    html: `<h2>Event Registration Confirmed</h2><p>Hi ${user.fullName}, you're registered for <strong>${event.title}</strong> on ${event.dateLabel}.</p>`,
    text: `Registered for ${event.title} on ${event.dateLabel}`,
  });
}
