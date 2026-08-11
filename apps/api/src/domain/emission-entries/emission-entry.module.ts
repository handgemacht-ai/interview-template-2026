import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmissionEntry } from './emission-entry.entity';
import { EmissionEntryService } from './services/emission-entry.service';
import { EmissionEntryController } from './controllers/emission-entry.controller';
import { ReportingPeriodModule } from '../reporting-periods/reporting-period.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionEntry]), ReportingPeriodModule],
  controllers: [EmissionEntryController],
  providers: [EmissionEntryService],
  exports: [EmissionEntryService],
})
export class EmissionEntryModule {}
