import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TransactionModule } from './interfaces/http/transaction/transaction.module';
import { WompiModule } from './modules/wompi/wompi.module';

@Module({
  imports: [
    // Carga variables desde el archivo .env automáticamente
    ConfigModule.forRoot({
      isGlobal: true, // Para que este disponible en toda la app
    }),

    // Modulo HTTP para hacer requests (lo usa wompi.service.ts)
    HttpModule,

    // Tu módulo de transacciones
    TransactionModule,

    // Módulo Wompi donde creaste wompi.service.ts
    WompiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
