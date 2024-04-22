import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScrapingModule } from './scraping/scraping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TweetModule } from './tweet/tweet.module';

@Module({
  imports: [PrismaModule, ScrapingModule, TweetModule, ScheduleModule.forRoot(), ConfigModule.forRoot(
    { isGlobal: true, }
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
