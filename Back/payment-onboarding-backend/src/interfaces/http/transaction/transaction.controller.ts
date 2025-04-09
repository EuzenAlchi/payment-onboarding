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
import { TransactionService } from 'src/app/transaction/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly wompiService: WompiService, 
    private readonly transactionService: TransactionService,
  ) {}

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

  console.log('📥 Webhook recibido de Wompi');
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));

  const transactionId = payload?.data?.transaction?.id;

  if (!transactionId) {
    console.error('⚠️ No se encontró el ID de transacción en el payload');
    return { received: false };
  }

  try {
    // 1. Consultar Wompi
    const wompiResponse = await this.wompiService.getTransactionStatus(transactionId);
    const { reference, status } = wompiResponse.data;

    // 2. Actualizar en la BD
    await this.transactionService.updateTransactionStatus(reference, status);

    return { received: true };
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return { received: false };
  }
}

  
}
