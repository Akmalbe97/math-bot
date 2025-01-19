import { Module } from '@nestjs/common';
import { MathBotModule } from './math-bot/math-bot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    MathBotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
