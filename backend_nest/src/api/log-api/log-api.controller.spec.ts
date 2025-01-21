import { Test, TestingModule } from '@nestjs/testing';
import { LogApiController } from './log-api.controller';

describe('MobileApiController', () => {
  let controller: LogApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogApiController],
    }).compile();

    controller = module.get<LogApiController>(LogApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
