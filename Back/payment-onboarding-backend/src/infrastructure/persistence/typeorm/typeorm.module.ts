// src/infrastructure/persistence/typeorm/typeorm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../typeorm/entities/transaction.entity';
import { TransactionRepositoryImpl } from '../typeorm/repositories/transaction.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: ['TransactionRepository'],
})
export class TypeOrmPersistenceModule {}
