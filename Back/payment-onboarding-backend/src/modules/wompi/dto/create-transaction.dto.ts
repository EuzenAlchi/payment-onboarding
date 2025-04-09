export class CreateTransactionDto {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  redirect_url: string;
  expiration_time?: string;

  card_data: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
  };

  customer_data: {
    phone_number: string;
    full_name: string;
    legal_id: string;
    legal_id_type: string;
  };

  shipping_address?: {
    address_line_1: string;
    address_line_2?: string;
    country: string;
    region: string;
    city: string;
    name?: string;
    phone_number: string;
    postal_code?: string;
  };

  payment_method?: {
    type: string;
    token: string;
    installments?: number;
  };
}