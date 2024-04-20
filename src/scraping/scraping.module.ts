import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ScrapingService],
  exports: [ScrapingService]
})
export class ScrapingModule { }
