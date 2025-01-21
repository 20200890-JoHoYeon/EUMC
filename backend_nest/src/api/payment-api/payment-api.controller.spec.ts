import { Test, TestingModule } from '@nestjs/testing';
import { PaymentApiController } from './payment-api.controller';

describe('PaymentApiController', () => {
  let controller: PaymentApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentApiController],
    }).compile();

    controller = module.get<PaymentApiController>(PaymentApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
