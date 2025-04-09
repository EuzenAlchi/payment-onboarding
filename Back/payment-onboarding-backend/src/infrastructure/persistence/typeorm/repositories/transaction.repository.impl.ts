import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { Transaction } from 'src/domain/models/transaction.model';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly ormRepo: Repository<TransactionEntity>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const entity = this.toEntity(transaction);
    const saved = await this.ormRepo.save(entity);
    return this.toModel(saved);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const entity = await this.ormRepo.findOne({ where: { reference } });
    return entity ? this.toModel(entity) : null;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.ormRepo.update(id, { status });
  }

  private toEntity(transaction: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    if (transaction.id) {
      entity.id = transaction.id;
    }
    entity.amount_in_cents = transaction.amountInCents;
    entity.currency = transaction.currency;
    entity.reference = transaction.reference;
    entity.status = transaction.status;
    entity.customer_email = transaction.customerEmail;
    entity.wompiTransactionId = transaction.wompiTransactionId || '';
    entity.created_at = transaction.createdAt || new Date();
    entity.payment_method_type = transaction.paymentMethodType;
    return entity;
  }

  private toModel(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      amountInCents: entity.amount_in_cents,
      currency: entity.currency,
      reference: entity.reference,
      status: entity.status,
      customerEmail: entity.customer_email,
      wompiTransactionId: entity.wompiTransactionId,
      createdAt: entity.created_at,
      paymentMethodType: entity.payment_method_type,
    };
  }
}
