import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.USE_API_PREFIX !== 'false') {
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
  
  const logger = new Logger('Bootstrap');
  logger.log(`✅ Application running: http://0.0.0.0:${port}/api`);
  logger.log(`📝 Auth endpoints:`);
  logger.log(`   POST /api/auth/register`);
  logger.log(`   POST /api/auth/login`);
  logger.log(`   POST /api/auth/logout`);
  logger.log(`   POST /api/auth/refresh`);
}
bootstrap();
