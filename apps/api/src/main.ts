import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  ResponseInterceptor,
  HttpExceptionFilter,
  PrismaExceptionFilter,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Feedback API')
    .setDescription('The Feedback application API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addServer('http://localhost:' + port, 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
