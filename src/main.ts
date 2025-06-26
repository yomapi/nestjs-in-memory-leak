import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startMemoryMonitor } from './memory-monitor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  startMemoryMonitor();
}
bootstrap();
