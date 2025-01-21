import { Test, TestingModule } from '@nestjs/testing';
import { ReservationApiController } from './reservation-api.controller';

describe('ReservationApiController', () => {
  let controller: ReservationApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationApiController],
    }).compile();

    controller = module.get<ReservationApiController>(ReservationApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
