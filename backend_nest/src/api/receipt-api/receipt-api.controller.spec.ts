import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptApiController } from './receipt-api.controller';

describe('ReceiptApiController', () => {
  let controller: ReceiptApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptApiController],
    }).compile();

    controller = module.get<ReceiptApiController>(ReceiptApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
