import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, PrismaService],
})
export class EnrollmentsModule {}