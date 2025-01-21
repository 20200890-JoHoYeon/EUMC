import { Test, TestingModule } from '@nestjs/testing';
import { OneSignalPushApiController } from './one-signal-push-api.controller';

describe('OneSignalPushApiController', () => {
  let controller: OneSignalPushApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OneSignalPushApiController],
    }).compile();

    controller = module.get<OneSignalPushApiController>(OneSignalPushApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
