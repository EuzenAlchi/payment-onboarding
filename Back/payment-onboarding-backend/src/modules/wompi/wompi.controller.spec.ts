import { Test, TestingModule } from '@nestjs/testing';
import { WompiController } from './wompi.controller';
import { WompiService } from './wompi.service';
import { TransactionService } from 'src/app/transaction/transaction.service';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';

describe('WompiController', () => {
  let controller: WompiController;
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
      controllers: [WompiController],
      providers: [
        { provide: WompiService, useValue: mockWompiService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<WompiController>(WompiController);
    wompiService = module.get<WompiService>(WompiService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call wompiService.createTransaction and return its response', async () => {
      const dto = plainToInstance(CreateTransactionDto, {
        amount_in_cents: 100000,
        currency: 'COP',
        customer_email: 'test@example.com',
        reference: 'REF123',
        payment_method_type: 'CARD',
        redirect_url: 'https://example.com/result',
        card_data: {
          number: '4242424242424242',
          exp_month: '12',
          exp_year: '29',
          cvc: '123',
          card_holder: 'Juan Perez',
        },
        customer_data: {
          phone_number: '573001112233',
          full_name: 'Juan Perez',
          legal_id: '123456789',
          legal_id_type: 'CC',
        },
      });

      const mockResponse = { id: 'wompi-id-123', status: 'PENDING' };
      mockWompiService.createTransaction.mockResolvedValue(mockResponse);

      const result = await controller.createTransaction(dto);

      expect(wompiService.createTransaction).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTransactionStatus', () => {
    it('should return transaction status by id', async () => {
      const mockStatus = { data: { status: 'APPROVED' } };
      mockWompiService.getTransactionStatus.mockResolvedValue(mockStatus);

      const result = await controller.getTransactionStatus('abc123');

      expect(wompiService.getTransactionStatus).toHaveBeenCalledWith('abc123');
      expect(result).toEqual(mockStatus);
    });
  });

  describe('handleWebhook', () => {
    it('should handle the webhook and update transaction status', async () => {
      const mockPayload: WompiWebhookDto = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: 'wompi-id-456',
            status: 'APPROVED',
            amount_in_cents: 100000,
            reference: 'REF456',
            customer_email: 'test@example.com',
            payment_method_type: 'CARD',
            created_at: '2024-01-01T00:00:00.000Z',
            finalized_at: '2024-01-01T00:05:00.000Z',
          },
        },
        sent_at: '2024-01-01T00:00:00.000Z',
        signature: 'sig-123',
      };

      const mockWompiResponse = {
        data: {
          reference: 'REF456',
          status: 'APPROVED',
        },
      };

      mockWompiService.getTransactionStatus.mockResolvedValue(mockWompiResponse);

      const result = await controller.handleWebhook(mockPayload, 'fake-signature');

      expect(wompiService.getTransactionStatus).toHaveBeenCalledWith('wompi-id-456');
      expect(transactionService.updateTransactionStatus).toHaveBeenCalledWith('REF456', 'APPROVED');
      expect(result).toEqual({ message: 'Webhook recibido y procesado correctamente' });
    });
  });
});
