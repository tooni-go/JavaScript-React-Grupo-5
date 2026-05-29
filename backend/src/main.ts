import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // En el servidor del poli, ~uno/api/* ya llega sin /api (ej. /health, /auth/login).
  // En local mantenemos el prefijo /api → http://localhost:3001/api/health
  const useApiPrefix = process.env.USE_API_PREFIX !== 'false';
  if (useApiPrefix) {
    app.setGlobalPrefix('api');
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  const base = useApiPrefix ? '/api' : '';
  console.log(`Application is running on: http://0.0.0.0:${port}${base}`);
}
bootstrap();
