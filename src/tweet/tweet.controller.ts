import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ScrapingService } from 'src/scraping/scraping.service';
import { TweetDto } from 'src/scraping/dto/tweet.dto';
import { Tweetservice } from './tweet.service';

@Controller('tweets')
export class TweetsController {
    constructor(private tweetsService: Tweetservice, private scrapingService: ScrapingService) { }

    @Get('/scrap')
    scraptweets() {
        this.scrapingService.scrapTweets()
    }

    @Get()
    gettweets(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.tweetsService.findAlltweets(page, pageSize);
    }

    @Get(':id')
    gettweetById(@Param('id') id: number) {
        return this.tweetsService.findtweetById(id);
    }
   
}