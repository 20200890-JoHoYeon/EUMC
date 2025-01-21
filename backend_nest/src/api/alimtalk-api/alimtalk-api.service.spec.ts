import { Test, TestingModule } from '@nestjs/testing';
import { AlimtalkApiService } from './alimtalk-api.service';

describe('AlimtalkApiService', () => {
  let service: AlimtalkApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlimtalkApiService],
    }).compile();

    service = module.get<AlimtalkApiService>(AlimtalkApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
