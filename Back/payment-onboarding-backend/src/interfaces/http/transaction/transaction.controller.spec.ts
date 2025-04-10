import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { WompiService } from 'src/modules/wompi/wompi.service';
import { TransactionService } from 'src/app/transaction/transaction.service';
import { CreateTransactionDto } from 'src/modules/wompi/dto/create-transaction.dto';
import { Request } from 'express';

describe('TransactionController', () => {
  let controller: TransactionController;
  let wompiService: WompiService;
  let transactionService: TransactionService;

  const mockWompiService = {
    createTransaction: jest.fn(),
    getTransactionStatus: jest.fn(),
  };

  const mockTransactionService = {
    updateTransactionStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: WompiService, useValue: mockWompiService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    wompiService = module.get<WompiService>(WompiService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call wompiService.createTransaction and return checkoutUrl', async () => {
      const dto: CreateTransactionDto = {
        amountInCents: 300000,
        currency: 'COP',
        customerEmail: 'test@example.com',
        reference: 'REF001',
        paymentMethodType: 'CARD',
        redirectUrl: 'https://example.com',
      } as any;

      const mockResult = { url: 'https://checkout.url' };

      mockWompiService.createTransaction.mockResolvedValue(mockResult);

      const result = await controller.createTransaction(dto as any);

      expect(wompiService.createTransaction).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ checkoutUrl: mockResult });
    });
  });

  describe('handleWebhook', () => {
    it('should process webhook and update transaction status', async () => {
      const mockPayload = {
        data: {
          transaction: {
            id: 'txn123',
          },
        },
      };

      const mockRequest = {
        body: mockPayload,
      } as Request;

      const mockWompiResponse = {
        data: {
          reference: 'REF001',
          status: 'APPROVED',
        },
      };

      mockWompiService.getTransactionStatus.mockResolvedValue(mockWompiResponse);

      const result = await controller.handleWebhook(mockRequest, 'checksum-value');

      expect(wompiService.getTransactionStatus).toHaveBeenCalledWith('txn123');
      expect(transactionService.updateTransactionStatus).toHaveBeenCalledWith('REF001', 'APPROVED');
      expect(result).toEqual({ received: true });
    });

    it('should return { received: false } if transaction ID is missing', async () => {
      const mockRequest = {
        body: {},
      } as Request;

      const result = await controller.handleWebhook(mockRequest, 'checksum-value');

      expect(result).toEqual({ received: false });
    });

    it('should return { received: false } if error occurs', async () => {
      const mockRequest = {
        body: {
          data: {
            transaction: { id: 'txn123' },
          },
        },
      } as Request;

      mockWompiService.getTransactionStatus.mockRejectedValue(new Error('Wompi API error'));

      const result = await controller.handleWebhook(mockRequest, 'checksum-value');

      expect(result).toEqual({ received: false });
    });
  });
});
