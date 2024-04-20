import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScrapingService {

  constructor(private prisma: PrismaService, private configService: ConfigService) { }

  // @Cron(CronExpression.EVERY_HOUR)
  async scrapePosts() {
    let browser = null
    try {
      console.log('Scraping posts...')
      browser = await puppeteer.launch({ headless: false });
      const page: Page = await browser.newPage();
      await page.goto(this.configService.get<string>("COINDESK_URL"), { waitUntil: 'domcontentloaded' });
      console.log('Page loaded');
      const selector = 'section.css-175oi2r > div.css-175oi2r > div'
      await page.waitForSelector(selector);
      const parent: ElementHandle<HTMLDivElement> = await page.$(selector);
      // Get all direct children of the parent element
      const children: Array<ElementHandle<HTMLDivElement>> = await parent.$$(`div[data-testid='cellInnerDiv']`);

      for (const child of children) {
        const tweetChild = await child.$('div > article > div > div > div:nth-child(2)');
        const tweetChildren = await tweetChild.$$('div');
        for (const i in tweetChildren) {
          const tweetText = await tweetChildren[i].evaluate(node => node.textContent);
          console.log('Text of element:', tweetText);
        }
      }

      await browser.close();
      console.log("browswer closed")
      // Process and save each post to the database
      // for (const post of posts) {
      //   await this.prisma.post.create({
      //     data: {
      //       text: post.text,
      //       images: { create: { url: post.image || '' } },
      //       videos: { create: { url: post.video || '' } }
      //     }
      //   });
      // }
    }
    catch (error) {
      console.error(error)
      await browser.close()
    }
  }
}


