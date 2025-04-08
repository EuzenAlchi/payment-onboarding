export class CreateCardTransactionDto {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
    customer_email: string;
    amount: number; // En pesos (ej: 15000 para $150.00)
  }
  