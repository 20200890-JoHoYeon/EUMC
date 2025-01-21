import { Test, TestingModule } from '@nestjs/testing';
import { EumcPayApiController } from './eumc-pay-api.controller';

describe('EumcPayApiController', () => {
  let controller: EumcPayApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EumcPayApiController],
    }).compile();

    controller = module.get<EumcPayApiController>(EumcPayApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
