import { Test, TestingModule } from '@nestjs/testing';
import { ReservationApiService } from './reservation-api.service';

describe('ReservationApiService', () => {
  let service: ReservationApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationApiService],
    }).compile();

    service = module.get<ReservationApiService>(ReservationApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
