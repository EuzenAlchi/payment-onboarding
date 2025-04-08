import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './interfaces/http/transaction/transaction.module';
import { TransactionService } from './app/transaction/transaction.service';

@Module({
  imports: [TransactionModule],
  controllers: [AppController],
  providers: [AppService, TransactionService],
})
export class AppModule {}
