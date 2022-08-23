import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import {AppModule} from './app.module';
/**
 * Start up entry of Application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const config = new DocumentBuilder()
      .setTitle('Aha Test')
      .setDescription('Aha API description')
      .setVersion('1.0')
      .addTag('Aha')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  await app.listen(8000);
}
bootstrap();
