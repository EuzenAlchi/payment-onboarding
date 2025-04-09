import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount_in_cents: number;

  @Column()
  currency: string;

  @Column()
  reference: string;

  @Column()
  status: string;

  @Column()
  customer_email: string;

  @Column()
  payment_method_type: string; 

  @Column({ nullable: true })
  wompiTransactionId: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
