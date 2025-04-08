import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WompiService } from '../../../modules/wompi/wompi.service';
import { CreateTransactionDto } from '../../../modules/wompi/dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly wompiService: WompiService) {}

  // Endpoint para crear una nueva transacción
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const checkoutUrl = await this.wompiService.createTransaction(createTransactionDto);
    return { checkoutUrl };
  }

  // Endpoint para recibir los webhooks de Wompi
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Headers('x-event-checksum') checksum: string) {
    const payload = req.body;

    console.log('Webhook recibido de Wompi');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Checksum:', checksum);


    return { received: true };
  }
}
