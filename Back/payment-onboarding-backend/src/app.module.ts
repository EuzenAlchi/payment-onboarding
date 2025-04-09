// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TransactionModule } from './interfaces/http/transaction/transaction.module';
import { WompiModule } from './modules/wompi/wompi.module';
import { TypeOrmPersistenceModule } from './infrastructure/persistence/typeorm/typeorm.module'; // 👈 importa tu módulo de persistencia

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
        username: config.get<string>('DB_USERNAME') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || 'postgres',
        database: config.get<string>('DB_NAME') || 'wompi_payments',
        autoLoadEntities: true,
        synchronize: true, // cuidado en prod
        logging: true,
      }),
    }),

    HttpModule,
    TypeOrmPersistenceModule, // 👈 IMPORTANTE: aquí se registra tu implementación
    TransactionModule,
    WompiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
