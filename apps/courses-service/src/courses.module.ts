import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService],
})
export class CoursesModule {}