import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './middleware/filters/http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './common/adapters/socket-io-adapter';
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from 'path';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  /** USE WebSocket.io WebSocket Adapter */
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.use(
    session({
      secret: 'eumc-adv',
      resave: false,
      saveUninitialized: false,
    }),
  );

  /**
   * Swagger Setting
   */
  const config = new DocumentBuilder()
    .setTitle('EUMC Relay API')
    .setDescription('EUMC Relay Server API')
    .setVersion('1.0.0')
    .setLicense('SHsoftnet', 'https://shsoftnet.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /** CORS설정 */
  app.enableCors(/*{
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }*/);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');


  /** DTO유효성 검사 */
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  /** HTTP Filter */
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
}
bootstrap();
