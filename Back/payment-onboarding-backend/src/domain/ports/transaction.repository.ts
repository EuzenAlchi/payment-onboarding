import { Transaction } from '../models/transaction.model';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByReference(reference: string): Promise<Transaction | null>;
  updateStatus(id: string, status: string): Promise<void>;
}
