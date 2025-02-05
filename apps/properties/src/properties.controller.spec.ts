import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

describe('PropertiesController', () => {
  let propertiesController: PropertiesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [PropertiesService],
    }).compile();

    propertiesController = app.get<PropertiesController>(PropertiesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(propertiesController.getHello()).toBe('Hello World!');
    });
  });
});
