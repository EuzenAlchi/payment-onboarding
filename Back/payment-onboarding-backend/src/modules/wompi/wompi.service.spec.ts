import { Test, TestingModule } from '@nestjs/testing';
import { WompiService } from './wompi.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from 'src/app/transaction/transaction.service';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';

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
      const mockResponse: AxiosResponse = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'token123',
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      };

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
      const mockResponse: AxiosResponse = {
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
      };

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
      const mockResponse: AxiosResponse = {
        data: { data: { status: 'APPROVED' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };

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
});
