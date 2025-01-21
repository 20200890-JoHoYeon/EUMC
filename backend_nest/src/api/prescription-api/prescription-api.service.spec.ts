import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionApiService } from './prescription-api.service';

describe('PrescriptionApiService', () => {
  let service: PrescriptionApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionApiService],
    }).compile();

    service = module.get<PrescriptionApiService>(PrescriptionApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
