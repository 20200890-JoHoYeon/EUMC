import { Test, TestingModule } from '@nestjs/testing';
import { EumcAppApiService } from './eumc-app-api.service';

describe('EumcPushApiService', () => {
  let service: EumcAppApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EumcAppApiService],
    }).compile();

    service = module.get<EumcAppApiService>(EumcAppApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
