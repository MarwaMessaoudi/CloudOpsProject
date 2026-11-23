import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService, TypeOrmModule],
})
export class ServersModule {}