import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../typeorm/entities/transaction.entity';
import { ProductEntity } from '../typeorm/entities/product.entity';
import { TransactionRepositoryImpl } from '../typeorm/repositories/transaction.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, ProductEntity])],
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: ['TransactionRepository'],
})
export class TypeOrmPersistenceModule {}
