import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class MathBotService {
  private bot: TelegramBot;
  private userState: Map<number, { questionCount: number; correctAnswers: number; currentAnswer?: number }> = new Map();

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Assalomu alaykum! Matematik savollarni boshlash uchun /quiz buyrug\'ini yuboring.');
    });

    this.bot.onText(/\/quiz/, (msg) => {
      const chatId = msg.chat.id;

      // Foydalanuvchi holatini o'rnatish
      this.userState.set(chatId, { questionCount: 0, correctAnswers: 0 });
      this.askQuestion(chatId);
    });

    this.bot.onText(/\/end/, (msg) => {
      const chatId = msg.chat.id;
      const user = this.userState.get(chatId);
      if (user) {
        this.bot.sendMessage(chatId, `Siz ${user.correctAnswers} ta savolga to'g'ri javob berdingiz.`);
        this.userState.delete(chatId); // Foydalanuvchi sessiyasini yakunlash
      }
    });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const user = this.userState.get(chatId);
      if (!user || msg.text?.startsWith('/')) return;

      const answer = parseInt(msg.text || '', 10);
      if (answer === user.currentAnswer) {
        user.correctAnswers++;
      }

      user.questionCount++;
      if (user.questionCount < 10) {
        this.askQuestion(chatId); // Keyingi savolni yuborish
      } else {
        this.bot.sendMessage(chatId, 'Tugatish uchun /end buyrug\'ini yuboring.');
        this.bot.sendMessage(chatId, 'Yana davom ettirish uchun /quiz buyrug\'ini yuboring.');
      }
    });
  }

  private askQuestion(chatId: number) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    const user = this.userState.get(chatId);
    if (user) {
      user.currentAnswer = correctAnswer;
    }

    this.bot.sendMessage(chatId, `${num1} + ${num2} = ?`);
  }
}
