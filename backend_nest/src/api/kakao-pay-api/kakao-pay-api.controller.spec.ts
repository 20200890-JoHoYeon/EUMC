import { Test, TestingModule } from '@nestjs/testing';
import { KakaoPayApiController } from './kakao-pay-api.controller';

describe('KakaoPayApiController', () => {
  let controller: KakaoPayApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KakaoPayApiController],
    }).compile();

    controller = module.get<KakaoPayApiController>(KakaoPayApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
