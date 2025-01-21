import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionApiController } from './prescription-api.controller';

describe('PrescriptionApiController', () => {
  let controller: PrescriptionApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionApiController],
    }).compile();

    controller = module.get<PrescriptionApiController>(PrescriptionApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
