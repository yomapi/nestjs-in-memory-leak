import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const uuid = randomUUID();
    return await this.appService.getHello(uuid);
  }
}
