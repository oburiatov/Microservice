import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GetController, HealthController } from './controllers/get.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule,HttpModule],
  controllers: [GetController,HealthController],
  providers: [AppGateway],
})
export class AppModule {}
