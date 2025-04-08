import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../../../app/transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService], // Asegúrate que esto esté aquí
})
export class TransactionModule {}
