import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from './transaction.controller';
import { TransactionService } from '../../../app/transaction/transaction.service';

import { TransactionEntity } from 'src/infrastructure/persistence/typeorm/entities/transaction.entity';
import { TransactionRepositoryImpl } from 'src/infrastructure/persistence/typeorm/repositories/transaction.repository.impl';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';

import { WompiModule } from '../../../modules/wompi/wompi.module';

@Module({
  imports: [
    WompiModule,
    TypeOrmModule.forFeature([TransactionEntity]), 
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'TransactionRepository', 
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: ['TransactionRepository', TransactionService],
})
export class TransactionModule {}
