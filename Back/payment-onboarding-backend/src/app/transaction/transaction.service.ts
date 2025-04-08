import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../interfaces/http/transaction/dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  createTransaction(createTransactionDto: CreateTransactionDto) {
    // Por ahora simulamos una transacción creada
    return {
      message: 'Transacción creada exitosamente',
      data: createTransactionDto,
    };
  }
}
