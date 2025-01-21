import { Test, TestingModule } from '@nestjs/testing';
import { TicketApiController } from './ticket-api.controller';

describe('SeoulNumberApiController', () => {
  let controller: TicketApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketApiController],
    }).compile();

    controller = module.get<TicketApiController>(TicketApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
