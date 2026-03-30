import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/client.entity';
import { Project } from '../projects/project.entity';
import { Invoice } from '../invoices/invoice.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Project, Invoice])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
