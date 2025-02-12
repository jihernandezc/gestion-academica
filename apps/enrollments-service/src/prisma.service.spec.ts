import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaClient = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should call $connect on module init', async () => {
    const connectSpy = jest.spyOn(prismaClient, '$connect').mockResolvedValue(undefined);

    await prismaService.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('should call $disconnect on module destroy', async () => {
    const disconnectSpy = jest.spyOn(prismaClient, '$disconnect').mockResolvedValue(undefined);

    await prismaService.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
