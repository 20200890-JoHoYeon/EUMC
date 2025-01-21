import { Test, TestingModule } from '@nestjs/testing';
import { CertApiController } from './cert-api.controller';

describe('CertApiController', () => {
  let controller: CertApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertApiController],
    }).compile();

    controller = module.get<CertApiController>(CertApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
