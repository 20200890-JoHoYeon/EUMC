import { Test, TestingModule } from '@nestjs/testing';
import { EmrSoapApiService } from './emr-soap-api.service';

describe('EmrSoapApiService', () => {
  let service: EmrSoapApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmrSoapApiService],
    }).compile();

    service = module.get<EmrSoapApiService>(EmrSoapApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
