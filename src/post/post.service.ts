import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) { }

    async createPost(postData: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({
            data: postData,
        });
    }

    async findAllPosts(page: number, pageSize: number): Promise<Post[]> {
        const skip = (page - 1) * pageSize;
        return this.prisma.post.findMany({
            skip: skip,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findPostById(id: number): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: { id },
        });
    }

    async updatePost(id: number, postData: Prisma.PostUpdateInput): Promise<Post> {
        return this.prisma.post.update({
            where: { id },
            data: postData,
        });
    }

    async deletePost(id: number): Promise<Post> {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}