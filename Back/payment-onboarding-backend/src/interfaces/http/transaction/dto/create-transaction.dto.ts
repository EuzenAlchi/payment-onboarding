import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @Expose({ name: 'amount_in_cents' })
  amountInCents: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEmail()
  @Expose({ name: 'customer_email' })
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'payment_method_type' })
  paymentMethodType: string;

  @Expose({ name: 'redirect_url' })
  redirectUrl?: string;
}
