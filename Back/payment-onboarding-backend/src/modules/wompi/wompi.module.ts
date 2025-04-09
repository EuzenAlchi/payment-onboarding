import { forwardRef, Module } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WompiController } from './wompi.controller';
import { TransactionModule } from 'src/interfaces/http/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    forwardRef(() => TransactionModule), // 👌 circular ref bien usado
  ],
  controllers: [WompiController],
  providers: [WompiService], // 👈 Aquí ya NO se incluye TransactionService
  exports: [WompiService],
})
export class WompiModule {}
