import Stripe from 'stripe';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';

class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(options: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: { [key: string]: string };
  }): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount: Math.round(options.amount * 100), // Convertir en centimes
        currency: options.currency,
        customer: options.customerId,
        metadata: options.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      logger.error('Erreur lors de la création du paiement:', error);
      throw new AppError('Erreur lors de la création du paiement', 500);
    }
  }

  async createCustomer(options: {
    email: string;
    name: string;
    metadata?: { [key: string]: string };
  }): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create({
        email: options.email,
        name: options.name,
        metadata: options.metadata,
      });
    } catch (error) {
      logger.error('Erreur lors de la création du client:', error);
      throw new AppError('Erreur lors de la création du client', 500);
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      logger.error('Erreur lors de la récupération du paiement:', error);
      throw new AppError('Erreur lors de la récupération du paiement', 500);
    }
  }

  async refundPayment(options: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        payment_intent: options.paymentIntentId,
        amount: options.amount ? Math.round(options.amount * 100) : undefined,
        reason: options.reason as Stripe.RefundCreateParams.Reason,
      });
    } catch (error) {
      logger.error('Erreur lors du remboursement:', error);
      throw new AppError('Erreur lors du remboursement', 500);
    }
  }

  async createSubscription(options: {
    customerId: string;
    priceId: string;
    metadata?: { [key: string]: string };
  }): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.create({
        customer: options.customerId,
        items: [{ price: options.priceId }],
        metadata: options.metadata,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      throw new AppError('Erreur lors de la création de l\'abonnement', 500);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw new AppError('Erreur lors de l\'annulation de l\'abonnement', 500);
    }
  }

  async handleWebhook(
    body: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error);
      throw new AppError('Erreur lors du traitement du webhook', 400);
    }
  }
}

export const paymentService = new PaymentService(); 