import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostEntityDto } from './dto/request.dto';
import { ScrapingService } from 'src/scraping/scraping.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostService, private scrapingService: ScrapingService) { }

    @Get('/scrap')
    scrapPosts() {
        this.scrapingService.scrapePosts()
    }

    @Get()
    getPosts(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.postsService.findAllPosts(page, pageSize);
    }

    @Get(':id')
    getPostById(@Param('id') id: number) {
        return this.postsService.findPostById(id);
    }

    @Post()
    createPost(@Body() postData: PostEntityDto) {
        return this.postsService.createPost(postData);
    }

    @Put(':id')
    updatePost(@Param('id') id: number, @Body() postData: PostEntityDto) {
        return this.postsService.updatePost(id, postData);
    }

    @Delete(':id')
    deletePost(@Param('id') id: number) {
        return this.postsService.deletePost(id);
    }
}