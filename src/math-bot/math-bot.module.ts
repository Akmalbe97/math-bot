import { Module } from '@nestjs/common';
import { MathBotService } from './math-bot.service';

@Module({
  controllers: [],
  providers: [MathBotService],
})
export class MathBotModule {}
