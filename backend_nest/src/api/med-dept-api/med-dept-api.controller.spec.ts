import { Test, TestingModule } from '@nestjs/testing';
import { MedDeptApiController } from './med-dept-api.controller';

describe('MedDeptApiController', () => {
  let controller: MedDeptApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedDeptApiController],
    }).compile();

    controller = module.get<MedDeptApiController>(MedDeptApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
