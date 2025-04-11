import { Controller, Post, Body, Get, Param ,Headers, InternalServerErrorException, } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';
import { TransactionService } from 'src/app/transaction/transaction.service';

@Controller('wompi')
export class WompiController {
  constructor(
    private readonly wompiService: WompiService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('transaction')
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.wompiService.createTransaction(dto);
  }

  @Get('transaction-status/:id')
  async getTransactionStatus(@Param('id') id: string) {
    return this.wompiService.getTransactionStatus(id);
  }

  @Post('webhook')
  async handleWebhook(
    @Body() payload: WompiWebhookDto,
    @Headers('X-Signature') xSignature: string,
  ) {
    try {
      const wompiTransactionId = payload.data.transaction.id;

      // 1. Consultar Wompi para obtener info actualizada
      const response = await this.wompiService.getTransactionStatus(wompiTransactionId);
      const { reference, status } = response.data;

      // 2. Actualizar en nuestra base de datos
      await this.transactionService.updateTransactionStatus(reference, status);

      return { message: 'Webhook recibido y procesado correctamente' };
    } catch (error) {
      console.error('Error procesando el webhook:', error);
      throw new InternalServerErrorException('Error procesando el webhook');
    }
  }

  @Get('transaction-by-reference/:reference')
    async getByReference(@Param('reference') reference: string) {
    return this.wompiService.getTransactionByReference(reference);
  }

}
