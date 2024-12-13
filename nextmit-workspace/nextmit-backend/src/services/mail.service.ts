import nodemailer from 'nodemailer';
import { logger } from '../config/logger';
import { AppError } from '../middleware/error';

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        ...options,
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new AppError('Erreur lors de l\'envoi de l\'email', 500);
    }
  }

  async sendVerificationEmail(options: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${options.token}`;

    const html = `
      <h1>Vérification de votre compte Nextmit</h1>
      <p>Bonjour ${options.name},</p>
      <p>Merci de vous être inscrit sur Nextmit ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
      <p><a href="${verifyUrl}">Vérifier mon compte</a></p>
      <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Nextmit</p>
    `;

    await this.sendMail({
      to: options.to,
      subject: 'Vérification de votre compte Nextmit',
      html,
    });
  }

  async sendPasswordResetEmail(options: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${options.token}`;

    const html = `
      <h1>Réinitialisation de votre mot de passe Nextmit</h1>
      <p>Bonjour ${options.name},</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
      <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Nextmit</p>
    `;

    await this.sendMail({
      to: options.to,
      subject: 'Réinitialisation de votre mot de passe Nextmit',
      html,
    });
  }

  async sendTicketConfirmation(options: {
    to: string;
    name: string;
    eventName: string;
    ticketType: string;
    quantity: number;
    totalPrice: number;
    qrCode: string;
  }): Promise<void> {
    const html = `
      <h1>Confirmation de votre réservation</h1>
      <p>Bonjour ${options.name},</p>
      <p>Votre réservation pour l'événement "${options.eventName}" a été confirmée !</p>
      <h2>Détails de la réservation :</h2>
      <ul>
        <li>Type de ticket : ${options.ticketType}</li>
        <li>Quantité : ${options.quantity}</li>
        <li>Prix total : ${options.totalPrice}€</li>
      </ul>
      <p>Voici votre QR Code d'accès :</p>
      <img src="${options.qrCode}" alt="QR Code" style="width: 200px; height: 200px;">
      <p>Présentez ce QR Code à l'entrée de l'événement.</p>
      <p>Cordialement,<br>L'équipe Nextmit</p>
    `;

    await this.sendMail({
      to: options.to,
      subject: `Confirmation de réservation - ${options.eventName}`,
      html,
    });
  }

  async sendEventReminder(options: {
    to: string;
    name: string;
    eventName: string;
    eventDate: Date;
    eventLocation: string;
  }): Promise<void> {
    const html = `
      <h1>Rappel : Événement à venir</h1>
      <p>Bonjour ${options.name},</p>
      <p>Nous vous rappelons que l'événement "${options.eventName}" aura lieu prochainement :</p>
      <ul>
        <li>Date : ${options.eventDate.toLocaleDateString('fr-FR')}</li>
        <li>Heure : ${options.eventDate.toLocaleTimeString('fr-FR')}</li>
        <li>Lieu : ${options.eventLocation}</li>
      </ul>
      <p>N'oubliez pas votre QR Code d'accès !</p>
      <p>Cordialement,<br>L'équipe Nextmit</p>
    `;

    await this.sendMail({
      to: options.to,
      subject: `Rappel : ${options.eventName}`,
      html,
    });
  }
}

export const mailService = new MailService(); 