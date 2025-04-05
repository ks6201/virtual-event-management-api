import { MAIL } from "../config";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

class MailService {
    #transporter;
    constructor(service: string) {
        
        this.#transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: MAIL.user,
                pass: MAIL.pass
            }
        });
    }

    /**
     * Sends an email.
     *
     * @param {string} from - The sender's email address.
     * @param {string} toMail - The recipient's email address.
     * @param {string} subject - The subject of the email.
     * @param {string} body - The body content of the email.
     */
    async sendMail(from: string, toMail: string, subject: string, body: string): Promise<boolean> {
        const mailOptions: Mail.Options = {
            from: `${from} <${process.env.MAIL_ID}>`,
            to: toMail,
            subject: subject.trim(),
            html: body.trim(),
        };

        try {
            await this.#transporter.sendMail(mailOptions);
            return true;
        } catch {
            return false;
        }
    }

}

export const mailService = new MailService("gmail");