import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { WompiModule } from '../../../modules/wompi/wompi.module';

@Module({
  imports: [WompiModule], // 👈 agregar aquí
  controllers: [TransactionController],
})
export class TransactionModule {}
