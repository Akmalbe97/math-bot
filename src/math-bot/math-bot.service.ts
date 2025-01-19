import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class MathBotService {
  private bot: TelegramBot;
  private userState: Map<number, { questionCount: number, correctAnswers: number }> = new Map();

  constructor() {
    // Telegram bot tokenini kiriting
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });

    // /start buyrug'ini qayd etish
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Assalomu alaykum! Matematik savollarni boshlash uchun /quiz buyrug\'ini yuboring.');
    });

    // /quiz buyrug'ini qayd etish va savollarni boshlash
    this.bot.onText(/\/quiz/, (msg) => {
      const chatId = msg.chat.id;

      // /end buyrug'i
      this.bot.onText(/\/end/, (msg) => {
        const chatId = msg.chat.id;
        const user = this.userState.get(chatId);
        if (user) {
          this.bot.sendMessage(chatId, `Siz ${user.correctAnswers} ta savolga to'g'ri javob berdingiz.`);
          this.userState.delete(chatId); // Foydalanuvchi sessiyasini yakunlash
        }
      });

      // Foydalanuvchi holatini o'rnatish
      this.userState.set(chatId, { questionCount: 0, correctAnswers: 0 });
      this.askQuestion(chatId);
    });

    // Javobni tekshirish va to'g'ri javoblar sonini hisoblash
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const user = this.userState.get(chatId);
      if (!user) return;

      // Agar foydalanuvchi savolga javob berayotgan bo'lsa
      if (msg.text && !msg.text.startsWith('/')) {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const correctAnswer = num1 + num2;
        const answer = parseInt(msg.text);

        if (answer !== correctAnswer) {
          user.correctAnswers++;
        }

        user.questionCount++;

        if (user.questionCount < 10) {
          this.askQuestion(chatId);  // Keyingi savolni yuborish
        } else {
          this.bot.sendMessage(chatId, "Yana savollarni ishlashni xohlaysizmi? /quiz buyrug'ini yuboring.");
          this.bot.sendMessage(chatId, "Tugatishni xohlaysizmi? /end buyrug'ini yuboring");
        }
      } 
    });
  }

  // Savolni foydalanuvchiga yuborish
  private askQuestion(chatId: number) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    this.bot.sendMessage(chatId, `${num1} + ${num2} = ?`);
  }
}
