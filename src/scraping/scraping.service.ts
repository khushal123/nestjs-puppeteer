import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { TweetDto } from './dto/tweet.dto';

@Injectable()
export class ScrapingService {

  constructor(private prisma: PrismaService, private configService: ConfigService) { }

  // @Cron(CronExpression.EVERY_HOUR)
  async scrapTweets() {
    let browser = null
    const scrappedTweets: Array<TweetDto> = []
    try {
      console.log('Scraping tweets...')
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
          const tweetUserName = await (await child.$("div[data-testid='User-Name']")).evaluate(node => node.textContent);
          const tweetText = await (await child.$("div[data-testid='tweetText']")).evaluate(node => node.textContent);
          const retweets = await (await child.$("div[data-testid='retweet']")).evaluate(node => node.textContent)
          const replies = await (await child.$("div[data-testid='reply']")).evaluate(node => node.textContent)
          const likes = await (await child.$("div[data-testid='like']")).evaluate(node => node.textContent)
          const article = await (await child.$("article[data-testid='tweet']"))
          const viewSelector = 'div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(4) > a > div > div:nth-child(2)> span'
          const views = await article.$eval(viewSelector, node => node.textContent) //data test id is not available
          const tweetImage = await child.$('div[data-testid="tweetPhoto"] > img');
          const tweetVideo = await child.$('data-testid="videoComponent"] > video');
          const tweetDto = new TweetDto()
          if (tweetVideo) {
            const tweetVideoSource = await tweetVideo.$('source');
            const tweetVideoUrl = await tweetVideoSource.evaluate(node => node.getAttribute('src'));
            const tweetVideoType = await tweetVideoSource.evaluate(node => node.getAttribute('type')); //ujse later
            tweetDto.tweetVideo = tweetVideoUrl
          }

          tweetDto.likes = likes
          tweetDto.replies = replies
          tweetDto.tweetUserName = tweetUserName
          tweetDto.tweetText = tweetText
          tweetDto.views = views

          if (tweetImage) {
            tweetDto.tweetImage = await tweetImage.evaluate(node => node.getAttribute('src'));
          }

          console.log("tweetUserName", tweetUserName)
          console.log("tweetText", tweetText)
          console.log("tweetImage", tweetImage)
          console.log("views", views)
          scrappedTweets.push(tweetDto)
        }
        console.log("browswer closed.")
      }
    }
    catch (error) {
      console.error(error)
    }
    finally {
      if (browser) {
        await browser.close()
      }
      if (scrappedTweets.length > 0) {
        await this.saveTweets(scrappedTweets)
      }
    }
  }

  private async saveTweets(tweets: Array<TweetDto>) {
    await this.prisma.tweet.createMany({
      data: tweets.map(tweet => {
        return {
          tweetUserName: tweet.tweetUserName,
          tweetText: tweet.tweetText,
          retweets: tweet.retweets,
          replies: tweet.replies,
          likes: tweet.likes,
          views: tweet.views,
          tweetImage: tweet.tweetImage,
          tweetVideo: tweet.tweetVideo
        }
      })
    })
    console.log("bulkInsert", "inserted tweets")
  }

  private async saveForNotificataion(tweets: Array<TweetDto>) {
    const userNamesToFetch = tweets.filter(tweet => tweet.tweetVideo || false).map(tweet => tweet.tweetUserName)
    const tweetsToNotify = await this.prisma.tweet.findMany({
      where: {
        tweetUserName: {
          in: userNamesToFetch
        }
      }
    })
    console.log("tweetsToNotify", tweetsToNotify)
    // await this.prisma.videoNotification.createMany({ data: tweetsToNotify.map(tweet => { return { tweetId: tweet.id } }) })
  }
}


