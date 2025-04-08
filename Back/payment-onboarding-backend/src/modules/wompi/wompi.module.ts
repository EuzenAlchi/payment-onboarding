import { Module } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; 
import { WompiController } from './wompi.controller';

@Module({
  imports: [ConfigModule, HttpModule], 
  controllers: [WompiController],
  providers: [WompiService],
  exports: [WompiService],
})
export class WompiModule {}
