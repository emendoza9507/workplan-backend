import { Test, TestingModule } from '@nestjs/testing';
import { WorkplanController } from './workplan.controller';
import { WorkplanService } from './services/workplan.service';

describe('WorkplanController', () => {
  let controller: WorkplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkplanController],
      providers: [WorkplanService],
    }).compile();

    controller = module.get<WorkplanController>(WorkplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
