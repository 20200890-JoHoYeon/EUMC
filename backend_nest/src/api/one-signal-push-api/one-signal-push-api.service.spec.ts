import { Test, TestingModule } from '@nestjs/testing';
import { OneSignalPushApiService } from './one-signal-push-api.service';

describe('OneSignalPushApiService', () => {
  let service: OneSignalPushApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneSignalPushApiService],
    }).compile();

    service = module.get<OneSignalPushApiService>(OneSignalPushApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
