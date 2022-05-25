import * as cors from  'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:'https://devopseek.me:30000',
    methods:['GET', 'POST'],
    credentials: true,
  })
  app.use(cors({
    
      origin:'https://devopseek.me:30000',
      methods:['GET', 'POST'],
      credentials: true
    
  }))
  app.useStaticAssets(join(__dirname, '..', 'static'));

  
  await app.listen(+process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}...`);
  });
}

bootstrap();
