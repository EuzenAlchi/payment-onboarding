import { Test, TestingModule } from '@nestjs/testing';
import { WompiService } from './wompi.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from 'src/app/transaction/transaction.service';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { throwError } from 'rxjs';
import { AxiosError } from 'axios';

describe('WompiService', () => {
  let service: WompiService;
  let httpService: HttpService;
  let transactionService: TransactionService;

  const mockConfigService = {
    get: (key: string) => {
      const config = {
        WOMPI_API_URL: 'https://api-sandbox.wompi.co/v1',
        WOMPI_PRIVATE_KEY: 'prv_test',
        WOMPI_PUBLIC_KEY: 'pub_test',
        WOMPI_INTEGRITY_KEY: 'integrity_test',
      };
      return config[key];
    },
  };

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockTransactionService = {
    saveTransaction: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    service = module.get<WompiService>(WompiService);
    httpService = module.get<HttpService>(HttpService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAcceptanceToken', () => {
    it('should return the acceptance_token from Wompi', async () => {
      mockHttpService.get.mockReturnValueOnce(of({
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'token123',
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      }));

      const token = await service['getAcceptanceToken']();
      expect(token).toBe('token123');
    });
  });

  describe('generateCardToken', () => {
    it('should return the card token', async () => {
      mockHttpService.post.mockReturnValueOnce(of({
        data: {
          data: {
            id: 'card-token-xyz',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      }));

      const cardData = {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '29',
        cvc: '123',
        card_holder: 'Juan Perez',
      };

      const token = await service['generateCardToken'](cardData);
      expect(token).toBe('card-token-xyz');
    });
  });

  describe('getTransactionStatus', () => {
    it('should fetch transaction status from Wompi', async () => {
      mockHttpService.get.mockReturnValueOnce(of({
        data: {
          data: {
            status: 'APPROVED',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      }));

      const status = await service.getTransactionStatus('abc123');
      expect(status.data.status).toBe('APPROVED');
    });
  });

  describe('createTransaction', () => {
    it('debería crear una transacción correctamente', async () => {
      const dto = {
        amount_in_cents: 50000,
        currency: 'COP',
        customer_email: 'cliente@test.com',
        reference: 'REF_TEST_123',
        redirect_url: 'https://miapp.com/resultado',
        card_data: {
          number: '4242424242424242',
          exp_month: '12',
          exp_year: '29',
          cvc: '123',
          card_holder: 'Juan Perez',
        },
        customer_data: {
          phone_number: '3001234567',
          full_name: 'Juan Perez',
          legal_id: '123456789',
          legal_id_type: 'CC',
        },
      };

      const mockAcceptanceToken = 'token123';
      const mockCardToken = 'cardTokenABC';
      const mockResponse: AxiosResponse = {
        data: {
          data: {
            id: 'txn_test_001',
            reference: dto.reference,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };

      jest.spyOn<any, any>(service, 'getAcceptanceToken').mockResolvedValue(mockAcceptanceToken);
      jest.spyOn<any, any>(service, 'generateCardToken').mockResolvedValue(mockCardToken);

      mockHttpService.post.mockReturnValueOnce(of(mockResponse));

      const result = await service.createTransaction(dto);

      expect(service['getAcceptanceToken']).toHaveBeenCalled();
      expect(service['generateCardToken']).toHaveBeenCalledWith(dto.card_data);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/transactions'),
        expect.objectContaining({
          amount_in_cents: dto.amount_in_cents,
          currency: dto.currency,
          reference: dto.reference,
          payment_method: {
            type: 'CARD',
            token: mockCardToken,
            installments: 1,
          },
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        }),
      );
      expect(transactionService.saveTransaction).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toEqual(mockResponse.data);
    });

    it('debería lanzar un error si la API de Wompi falla', async () => {
      const dto = {
        amount_in_cents: 50000,
        currency: 'COP',
        customer_email: 'cliente@test.com',
        reference: 'REF_TEST_ERROR',
        redirect_url: 'https://miapp.com/resultado',
        card_data: {
          number: '4242424242424242',
          exp_month: '12',
          exp_year: '29',
          cvc: '123',
          card_holder: 'Juan Perez',
        },
        customer_data: {
          phone_number: '3001234567',
          full_name: 'Juan Perez',
          legal_id: '123456789',
          legal_id_type: 'CC',
        },
      };
    
      const mockAcceptanceToken = 'token123';
      const mockCardToken = 'cardTokenABC';
    
      jest.spyOn<any, any>(service, 'getAcceptanceToken').mockResolvedValue(mockAcceptanceToken);
      jest.spyOn<any, any>(service, 'generateCardToken').mockResolvedValue(mockCardToken);
    
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Invalid request' },
          headers: {},
        },
        toJSON: () => ({}),
      } as AxiosError;
    
      mockHttpService.post.mockReturnValueOnce(throwError(() => error));
    
      await expect(service.createTransaction(dto)).rejects.toThrow(HttpException);
      expect(transactionService.saveTransaction).not.toHaveBeenCalled();
    });    

  });
});