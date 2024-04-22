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
    const scrappedTweets = []
    try {
      console.log('Scraping posts...')

      browser = await puppeteer.launch({ headless: false });
      const page: Page = await browser.newPage();
      await page.goto(this.configService.get<string>("COINDESK_URL"), { waitUntil: 'domcontentloaded' });
      console.log('Page loaded');
      const selector = 'section[aria-labelledby="accessible-list-0"]'
      await page.waitForSelector(selector);
      const parent: ElementHandle<HTMLElement> = await page.$(selector);
      while (scrappedTweets.length < 5) {
        if (scrappedTweets.length > 0) {
          await page.evaluate(() => {
            window.scrollBy(0, 500); // Scroll down by 500 pixels
          });
        }
        const children: Array<ElementHandle<HTMLDivElement>> = await parent.$$(`div[data-testid='cellInnerDiv']`);
        for (const child of children) {
          const tweetUserName = await child.$("div[data-testid='User-Name']");
          const tweetText = await child.$("div[data-testid='tweetText']");
          const tweetImage = await child.$('div[data-testid="tweetPhoto"] > img');
          const retweets = (await child.$("div[data-testid='retweet']")).evaluate(node => node.textContent || 0)
          const replies = (await child.$("div[data-testid='reply']")).evaluate(node => node.textContent || 0)
          const likes = (await child.$("div[data-testid='like']")).evaluate(node => node.textContent || 0)
          const article = (await child.$("article[data-testid='tweet']"))
          const viewSelector = 'div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(4) > a > div > div:nth-child(2)> span'
          const views = await article.$eval(viewSelector, node => node.textContent) //data test id is not available
          console.log("tweetUserName", tweetUserName)
          console.log("tweetText", tweetText)
          console.log("tweetImage", tweetImage)
          console.log("tweetImage", retweets)
          console.log("tweetImage", replies)
          console.log("tweetImage", likes)
          console.log("views", views)
        }

        // await browser.close();
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
    }
    catch (error) {
      console.error(error)
      await browser.close()
    }
  }
}


