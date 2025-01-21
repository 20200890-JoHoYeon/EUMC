import { Test, TestingModule } from '@nestjs/testing';
import { TicketTcpGateway } from './ticket-tcp.gateway';

describe('TicketTcpGateway', () => {
  let gateway: TicketTcpGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTcpGateway],
    }).compile();

    gateway = module.get<TicketTcpGateway>(TicketTcpGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
