import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GetController} from './controllers/get.controller';

@Module({
  imports: [],
  controllers: [GetController],
  providers: [AppGateway],
})
export class AppModule {}
