import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
app.enableCors({
  origin: 'https://moviefront-edvy.onrender.com', 
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
  
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();