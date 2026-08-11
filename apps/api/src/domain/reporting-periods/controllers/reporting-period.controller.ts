import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IReportingPeriod } from '@interview/common';
import {
  OrganizationIdentityDto,
  ReportingPeriodIdentityDto,
} from '../../../common/dto/identity.dto';
import { ReportingPeriodService } from '../services/reporting-period.service';
import { CreateReportingPeriodDto } from '../dtos/reporting-period.dto';

@Controller('organizations/:organizationId/reporting-periods')
export class ReportingPeriodController {
  constructor(private readonly reportingPeriodService: ReportingPeriodService) {}

  @Get()
  async findAll(@Param() params: OrganizationIdentityDto): Promise<IReportingPeriod[]> {
    const periods = await this.reportingPeriodService.findAll(params.organizationId);
    return periods.map((rp) => rp.toApi());
  }

  @Post()
  async create(
    @Param() params: OrganizationIdentityDto,
    @Body() dto: CreateReportingPeriodDto,
  ): Promise<IReportingPeriod> {
    const period = await this.reportingPeriodService.create(params.organizationId, dto);
    return period.toApi();
  }

  @Get(':reportingPeriodId')
  async findOne(@Param() params: ReportingPeriodIdentityDto): Promise<IReportingPeriod> {
    const period = await this.reportingPeriodService.findOne(
      params.organizationId,
      params.reportingPeriodId,
    );
    return period.toApi();
  }

  @Put(':reportingPeriodId')
  async update(
    @Param() params: ReportingPeriodIdentityDto,
    @Body() dto: CreateReportingPeriodDto,
  ): Promise<IReportingPeriod> {
    const period = await this.reportingPeriodService.update(
      params.organizationId,
      params.reportingPeriodId,
      dto,
    );
    return period.toApi();
  }

  @Delete(':reportingPeriodId')
  async remove(@Param() params: ReportingPeriodIdentityDto): Promise<void> {
    return this.reportingPeriodService.remove(params.organizationId, params.reportingPeriodId);
  }
}
