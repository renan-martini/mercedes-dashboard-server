import { Module } from '@nestjs/common';
import { ProjectsModule } from './resources/projects/projects.module';
import { BaumstersModule } from './resources/baumsters/baumsters.module';
import { LegsModule } from './resources/legs/legs.module';

@Module({
  imports: [ProjectsModule, BaumstersModule, LegsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
