import { Injectable } from '@nestjs/common';
import { Tweet, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TweetDto } from 'src/scraping/dto/tweet.dto';
import { ScrapingService } from 'src/scraping/scraping.service';

@Injectable()
export class Tweetservice {
    constructor(private prisma: PrismaService, private scrapingService: ScrapingService) { }


    async findAlltweets(page: number, pageSize: number): Promise<TweetDto[]> {
        const skip = (page - 1) * pageSize;
        // return this.prisma.tweet.findMany({
        //     skip: skip,
        //     take: pageSize,
        //     orderBy: {
        //         createdAt: 'desc'
        //     }
        // });
        return null
    }

    async findtweetById(id: number): Promise<TweetDto | null> {
        // return this.prisma.tweet.findUnique({
        //     where: { id },
        // });
        return null
    }

}