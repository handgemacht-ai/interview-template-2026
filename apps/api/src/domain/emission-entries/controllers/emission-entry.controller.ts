import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IEmissionEntry } from '@interview/common';
import {
  ReportingPeriodIdentityDto,
  EmissionEntryIdentityDto,
} from '../../../common/dto/identity.dto';
import { EmissionEntryService } from '../services/emission-entry.service';
import { CreateEmissionEntryDto } from '../dtos/emission-entry.dto';

@Controller(
  'organizations/:organizationId/reporting-periods/:reportingPeriodId/emission-entries',
)
export class EmissionEntryController {
  constructor(private readonly emissionEntryService: EmissionEntryService) {}

  @Get()
  async findAll(@Param() params: ReportingPeriodIdentityDto): Promise<IEmissionEntry[]> {
    const entries = await this.emissionEntryService.findAll(
      params.organizationId,
      params.reportingPeriodId,
    );
    return entries.map((entry) => entry.toApi());
  }

  @Post()
  async create(
    @Param() params: ReportingPeriodIdentityDto,
    @Body() dto: CreateEmissionEntryDto,
  ): Promise<IEmissionEntry> {
    const entry = await this.emissionEntryService.create(
      params.organizationId,
      params.reportingPeriodId,
      dto,
    );
    return entry.toApi();
  }

  @Get(':emissionEntryId')
  async findOne(@Param() params: EmissionEntryIdentityDto): Promise<IEmissionEntry> {
    const entry = await this.emissionEntryService.findOne(
      params.organizationId,
      params.reportingPeriodId,
      params.emissionEntryId,
    );
    return entry.toApi();
  }

  @Put(':emissionEntryId')
  async update(
    @Param() params: EmissionEntryIdentityDto,
    @Body() dto: CreateEmissionEntryDto,
  ): Promise<IEmissionEntry> {
    const entry = await this.emissionEntryService.update(
      params.organizationId,
      params.reportingPeriodId,
      params.emissionEntryId,
      dto,
    );
    return entry.toApi();
  }

  @Delete(':emissionEntryId')
  async remove(@Param() params: EmissionEntryIdentityDto): Promise<void> {
    return this.emissionEntryService.remove(
      params.organizationId,
      params.reportingPeriodId,
      params.emissionEntryId,
    );
  }
}
