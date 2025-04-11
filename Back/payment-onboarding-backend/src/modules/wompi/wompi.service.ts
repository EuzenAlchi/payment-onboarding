import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, HttpException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { TransactionService } from 'src/app/transaction/transaction.service';

@Injectable()
export class WompiService {
  private readonly apiUrl: string;
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly integrityKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
  ) {
    this.apiUrl = this.configService.get<string>('WOMPI_API_URL')!;
    this.privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY')!;
    this.publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY')!;
    this.integrityKey = this.configService.get<string>('WOMPI_INTEGRITY_KEY')!;
  }

  private generateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
    expirationTime?: string,
  ): string {
    const base = `${reference}${amountInCents}${currency}${
      expirationTime ?? ''
    }${this.integrityKey}`;
    const hash = crypto.createHash('sha256').update(base).digest('hex');
    return hash;
  }

  private async getAcceptanceToken(): Promise<string> {
    try {
      const url = `${this.apiUrl}/merchants/${this.publicKey}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error('❌ Error obteniendo acceptance_token:', error.response?.data || error.message);
      throw new HttpException('No se pudo obtener el acceptance_token', 500);
    }
  }

  private async generateCardToken(cardData: CreateTransactionDto['card_data']): Promise<string> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.publicKey}`,
      };

      const url = `${this.apiUrl}/tokens/cards`;
      const response = await firstValueFrom(
        this.httpService.post(url, cardData, { headers }),
      );

      return response.data.data.id;
    } catch (error) {
      console.error('❌ Error generando el token de tarjeta:', error.response?.data || error.message);
      throw new HttpException('No se pudo generar el token de tarjeta', 500);
    }
  }

  async createTransaction(dto: CreateTransactionDto): Promise<any> {
    try {
      const acceptanceToken = await this.getAcceptanceToken();
      const token = await this.generateCardToken(dto.card_data);

      const signature = this.generateSignature(
        dto.reference,
        dto.amount_in_cents,
        dto.currency,
        dto.expiration_time,
      );

      const payload: any = {
        acceptance_token: acceptanceToken,
        amount_in_cents: dto.amount_in_cents,
        currency: dto.currency,
        customer_email: dto.customer_email,
        reference: dto.reference,
        redirect_url: dto.redirect_url,
        signature,
        payment_method: {
          type: 'CARD',
          token,
          installments: 1,
        },
        customer_data: dto.customer_data,
      };

      if (dto.shipping_address) {
        payload.shipping_address = dto.shipping_address;
      }
      if (dto.expiration_time) {
        payload.expiration_time = dto.expiration_time;
      }

      console.log('📦 Payload enviado a Wompi:', payload);

      const headers = {
        Authorization: `Bearer ${this.privateKey}`,
        'Content-Type': 'application/json',
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/transactions`, payload, {
          headers,
        }),
      );

      await this.transactionService.saveTransaction(response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Error creando la transacción:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      throw new HttpException(
        {
          message: 'Error en la solicitud a Wompi',
          wompiError: error.response?.data,
        },
        error.response?.status || 500,
      );
    }
  }

  async getTransactionStatus(transactionId: string): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.privateKey}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/transactions/${transactionId}`, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error consultando estado de la transacción:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      throw new HttpException({
        message: 'Error consultando el estado de la transacción',
        wompiError: error.response?.data || null,
      }, error.response?.status || 500);
    }
  }  

  async handleWebhook(payload: WompiWebhookDto, xSignature: string): Promise<any> {
  
    console.log('📥 Webhook recibido:', payload.event);
    console.log('📦 Transacción:', payload.data.transaction);
    return { message: 'Webhook recibido correctamente' };
  }

  async getTransactionByReference(reference: string) {
    const headers = {
      Authorization: `Bearer ${this.privateKey}`,
    }
  
    const url = `${this.apiUrl}/transactions?reference=${reference}`
    const response = await firstValueFrom(
      this.httpService.get(url, { headers }),
    )
    return response.data?.data?.length ? response.data.data[0] : null
  }
  
}

