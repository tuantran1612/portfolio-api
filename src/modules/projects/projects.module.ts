import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { RevalidateService } from '../../common/services/revalidate.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService,RevalidateService],
})
export class ProjectsModule {}