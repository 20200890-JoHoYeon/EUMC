import { Test, TestingModule } from '@nestjs/testing';
import { CertApiService } from './cert-api.service';

describe('CertApiService', () => {
  let service: CertApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertApiService],
    }).compile();

    service = module.get<CertApiService>(CertApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
