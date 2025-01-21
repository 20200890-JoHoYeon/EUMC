import { Test, TestingModule } from '@nestjs/testing';
import { MedDeptApiService } from './med-dept-api.service';

describe('MedDeptApiService', () => {
  let service: MedDeptApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedDeptApiService],
    }).compile();

    service = module.get<MedDeptApiService>(MedDeptApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
