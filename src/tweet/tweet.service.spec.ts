import { Test, TestingModule } from '@nestjs/testing';
import { tweetservice } from './tweet.service';

describe('tweetservice', () => {
  let service: tweetservice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [tweetservice],
    }).compile();

    service = module.get<tweetservice>(tweetservice);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
