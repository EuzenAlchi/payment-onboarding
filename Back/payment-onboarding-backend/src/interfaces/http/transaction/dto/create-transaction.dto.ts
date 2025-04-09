import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amountInCents: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodType: string;
}
