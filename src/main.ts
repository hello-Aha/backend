import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import {AppModule} from './app.module';
/**
 * Start up entry of Application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('Aha Test')
      .setDescription('Aha API description')
      .setVersion('1.0')
      .addTag('Aha')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
