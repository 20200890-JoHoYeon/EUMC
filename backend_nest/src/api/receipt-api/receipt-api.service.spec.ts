import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptApiService } from './receipt-api.service';

describe('ReceiptApiService', () => {
  let service: ReceiptApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptApiService],
    }).compile();

    service = module.get<ReceiptApiService>(ReceiptApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
