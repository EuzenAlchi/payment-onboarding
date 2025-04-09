// src/modules/wompi/dto/wompi-webhook.dto.ts
export class WompiWebhookDto {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      amount_in_cents: number;
      reference: string;
      customer_email: string;
      payment_method_type: string;
      created_at: string;
      finalized_at: string;
    };
  };
  sent_at: string;
  signature: string;
}