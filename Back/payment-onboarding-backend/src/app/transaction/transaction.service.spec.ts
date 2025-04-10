import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { Transaction } from 'src/domain/models/transaction.model';

const mockTransaction: Transaction = {
  id: 'uuid-123',
  amountInCents: 100000,
  currency: 'COP',
  reference: 'TEST_REF_123',
  status: 'PENDING',
  customerEmail: 'test@example.com',
  paymentMethodType: 'CARD',
  wompiTransactionId: 'wompi-id-999',
  createdAt: new Date(),
};

describe('TransactionService', () => {
  let service: TransactionService;
  let repo: TransactionRepository;

  const transactionRepositoryMock: Partial<TransactionRepository> = {
    save: jest.fn().mockResolvedValue(mockTransaction),
    findByReference: jest.fn().mockResolvedValue(mockTransaction),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repo = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should create a transaction', async () => {
    const dto = {
      amountInCents: 100000,
      currency: 'COP',
      customerEmail: 'test@example.com',
      reference: 'TEST_REF_123',
      paymentMethodType: 'CARD',
    };

    const result = await service.createTransaction(dto as any);

    expect(repo.save).toHaveBeenCalled();
    expect(result.reference).toBe(dto.reference);
  });

  it('should return a transaction by reference', async () => {
    const result = await service.getTransactionByReference('TEST_REF_123');
    expect(repo.findByReference).toHaveBeenCalledWith('TEST_REF_123');
    expect(result?.reference).toBe('TEST_REF_123');
  });

  it('should update status if transaction exists', async () => {
    await service.updateTransactionStatus('TEST_REF_123', 'APPROVED');
    expect(repo.updateStatus).toHaveBeenCalledWith('uuid-123', 'APPROVED');
  });

  it('should save a transaction from Wompi response', async () => {
    const wompiResponse = {
      data: {
        id: 'wompi-id-999',
        amount_in_cents: 100000,
        currency: 'COP',
        reference: 'TEST_REF_123',
        customer_email: 'test@example.com',
        payment_method_type: 'CARD',
        status: 'PENDING',
        created_at: '2025-04-10T00:00:00.000Z',
      },
    };

    const result = await service.saveTransaction(wompiResponse);
    expect(repo.save).toHaveBeenCalled();
    expect(result.wompiTransactionId).toBe('wompi-id-999');
  });
});