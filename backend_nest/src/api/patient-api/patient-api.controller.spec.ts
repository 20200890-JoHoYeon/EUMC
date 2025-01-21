import { Test, TestingModule } from '@nestjs/testing';
import { PatientApiController } from './patient-api.controller';

describe('PatientApiController', () => {
  let controller: PatientApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientApiController],
    }).compile();

    controller = module.get<PatientApiController>(PatientApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
