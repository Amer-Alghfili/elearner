"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedback(
  feedback: string
): Promise<{ error?: string }> {
  if (!feedback.trim()) {
    return { error: "Feedback cannot be empty" };
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ameralghfili@gmail.com",
    subject: "Elearner Feedback",
    text: feedback,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
