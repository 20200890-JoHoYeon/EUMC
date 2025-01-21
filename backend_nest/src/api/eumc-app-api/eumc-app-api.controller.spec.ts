import { Test, TestingModule } from '@nestjs/testing';
import { EumcAppApiController } from './eumc-app-api.controller';

describe('EumcPushApiController', () => {
  let controller: EumcAppApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EumcAppApiController],
    }).compile();

    controller = module.get<EumcAppApiController>(EumcAppApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
