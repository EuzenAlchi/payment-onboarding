import { Injectable, Inject } from '@nestjs/common';
import { CreateTransactionDto } from '../../interfaces/http/transaction/dto/create-transaction.dto';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { Transaction } from 'src/domain/models/transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction(
      '', // id generado por TypeORM
      dto.amountInCents,
      dto.currency,
      dto.customerEmail,
      dto.reference,
      dto.paymentMethodType || 'CARD',
      'PENDING',
      new Date(), // createdAt
    );
  
    return this.transactionRepository.save(transaction);
  }

  async getTransactionByReference(reference: string): Promise<Transaction | null> {
    return this.transactionRepository.findByReference(reference);
  }

  async updateTransactionStatus(reference: string, status: string): Promise<void> {
    const transaction = await this.transactionRepository.findByReference(reference);
    if (transaction) {
      await this.transactionRepository.updateStatus(transaction.id, status);
    }
  }

  async saveTransaction(response: any): Promise<Transaction> {
    const data = response.data || response;
  
    const transaction = new Transaction(
      '', // el id lo genera TypeORM
      data.amount_in_cents,
      data.currency,
      data.customer_email,
      data.reference,
      data.payment_method_type || 'CARD',
      data.status || 'PENDING',
      new Date(data.created_at || Date.now()), // por si viene el timestamp
      data.id // wompiTransactionId
    );
  
    return this.transactionRepository.save(transaction);
  }
  
}