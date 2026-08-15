import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env.js';

let transporter: Transporter | null = null;

if (env.mail.host) {
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
  });
}

export interface NotifyInput {
  to: string;
  subject: string;
  text: string;
}

export interface NotifyResult {
  delivered: boolean;
  error?: string;
}

/**
 * Invia una notifica interna. Senza SMTP configurato scrive a console, così in
 * locale si vede cosa sarebbe partito senza dover configurare nulla.
 */
export async function notify({ to, subject, text }: NotifyInput): Promise<NotifyResult> {
  if (!transporter) {
    console.log(`\n[mail non configurata] → ${to}\n  ${subject}\n${text}\n`);
    return { delivered: false };
  }

  try {
    await transporter.sendMail({ from: env.mail.from, to, subject, text });
    return { delivered: true };
  } catch (error) {
    // Una notifica fallita non deve far fallire l'invio del form: il dato è
    // già salvato a database e resta visibile nell'area admin.
    const message = error instanceof Error ? error.message : String(error);
    console.error('[mail] invio fallito:', message);
    return { delivered: false, error: message };
  }
}
