import { Controller, Post, Body } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('wompi') // Ruta base: /wompi
export class WompiController {
  constructor(private readonly wompiService: WompiService) {}

  @Post('transaction') // Ruta completa: POST /wompi/transaction
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.wompiService.createTransaction(dto);
  }
}
