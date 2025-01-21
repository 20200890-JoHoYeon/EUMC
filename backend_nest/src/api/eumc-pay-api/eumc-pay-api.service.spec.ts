import { Test, TestingModule } from '@nestjs/testing';
import { EumcPayApiService } from './eumc-pay-api.service';

describe('EumcPayApiService', () => {
  let service: EumcPayApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EumcPayApiService],
    }).compile();

    service = module.get<EumcPayApiService>(EumcPayApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
