import { Test, TestingModule } from '@nestjs/testing';
import { PatientApiService } from './patient-api.service';

describe('PatientApiService', () => {
  let service: PatientApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientApiService],
    }).compile();

    service = module.get<PatientApiService>(PatientApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
