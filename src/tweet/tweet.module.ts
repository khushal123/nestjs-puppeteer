import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScrapingModule } from 'src/scraping/scraping.module';
import { tweetservice } from './tweet.service';
import { TweetsController } from './tweet.controller';

@Module({
    imports: [PrismaModule, ScrapingModule],
    providers: [tweetservice],
    exports: [tweetservice],
    controllers: [TweetsController]
})
export class TweetModule { }
