import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 7001
  await app.listen(PORT, () => {
    console.log(`Port is running in the ${PORT} port`)
  })
}
bootstrap();
