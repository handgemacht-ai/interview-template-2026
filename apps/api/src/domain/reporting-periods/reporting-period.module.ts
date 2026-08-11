import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingPeriod } from './reporting-period.entity';
import { ReportingPeriodService } from './services/reporting-period.service';
import { ReportingPeriodController } from './controllers/reporting-period.controller';
import { OrganizationModule } from '../organizations/organization.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportingPeriod]), OrganizationModule],
  controllers: [ReportingPeriodController],
  providers: [ReportingPeriodService],
  exports: [ReportingPeriodService],
})
export class ReportingPeriodModule {}
