import { Module } from '@nestjs/common';
import { CharlasService } from './charlas.service';
import { CharlasController } from './charlas.controller';

@Module({
  controllers: [CharlasController],
  providers: [CharlasService],
  exports: [CharlasService],
})
export class CharlasModule {}
