import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenController } from './access_token.controller';
import { AccessTokenService } from './access_token.service';

describe('AccessTokenController', () => {
  let controller: AccessTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessTokenController],
      providers: [AccessTokenService],
    }).compile();

    controller = module.get<AccessTokenController>(AccessTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
