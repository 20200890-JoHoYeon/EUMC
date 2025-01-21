import { Test, TestingModule } from '@nestjs/testing';
import { LogApiService } from './log-api.service';

describe('MobileApiService', () => {
  let service: LogApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogApiService],
    }).compile();

    service = module.get<LogApiService>(LogApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
