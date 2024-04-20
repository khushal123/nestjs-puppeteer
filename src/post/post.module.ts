import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScrapingModule } from 'src/scraping/scraping.module';
import { PostService } from './post.service';
import { PostsController } from './post.controller';

@Module({
    imports: [PrismaModule, ScrapingModule],
    providers: [PostService],
    exports: [PostService],
    controllers: [PostsController]
})
export class PostModule { }
