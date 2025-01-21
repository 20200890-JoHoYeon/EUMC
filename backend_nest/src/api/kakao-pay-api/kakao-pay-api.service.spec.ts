import { Test, TestingModule } from '@nestjs/testing';
import { KakaoPayApiService } from './kakao-pay-api.service';

describe('KakaoPayApiService', () => {
  let service: KakaoPayApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KakaoPayApiService],
    }).compile();

    service = module.get<KakaoPayApiService>(KakaoPayApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
