import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
globalThis.self = globalThis;
import 'unfetch/polyfill';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// globalThis.fetch = fetch;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('The blog APIs description')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
