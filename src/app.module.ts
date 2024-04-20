import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScrapingModule } from './scraping/scraping.module';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ScrapingModule, PostModule, ScheduleModule.forRoot(), ConfigModule.forRoot(
    { isGlobal: true, }
  )],
  controllers: [AppController],
  providers: [AppService, PostService],
})
export class AppModule { }
