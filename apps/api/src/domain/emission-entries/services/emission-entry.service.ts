import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { TransactionalHandler } from '../../../common/transactional-handler';
import { EmissionEntry } from '../emission-entry.entity';
import { CreateEmissionEntryDto } from '../dtos/emission-entry.dto';
import { ReportingPeriodService } from '../../reporting-periods/services/reporting-period.service';

@Injectable()
export class EmissionEntryService extends TransactionalHandler<EmissionEntry> {
  constructor(
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
    private readonly reportingPeriodService: ReportingPeriodService,
  ) {
    super(txHost, EmissionEntry);
  }

  @Transactional()
  async findAll(organizationId: string, reportingPeriodId: string): Promise<EmissionEntry[]> {
    await this.reportingPeriodService.findOne(organizationId, reportingPeriodId);
    return this.repositoryTransactional.find({
      where: { belongsToReportingPeriodId: reportingPeriodId },
    });
  }

  @Transactional()
  async findOne(
    organizationId: string,
    reportingPeriodId: string,
    id: string,
  ): Promise<EmissionEntry> {
    await this.reportingPeriodService.findOne(organizationId, reportingPeriodId);
    const entry = await this.repositoryTransactional.findOne({
      where: { id, belongsToReportingPeriodId: reportingPeriodId },
    });
    if (!entry) {
      throw new NotFoundException(`Emission entry with id ${id} not found`);
    }
    return entry;
  }

  @Transactional()
  async create(
    organizationId: string,
    reportingPeriodId: string,
    dto: CreateEmissionEntryDto,
  ): Promise<EmissionEntry> {
    await this.reportingPeriodService.findOne(organizationId, reportingPeriodId);
    const entry = new EmissionEntry({
      scope: dto.scope,
      category: dto.category,
      source: dto.source,
      value: dto.value,
      unit: dto.unit,
      description: dto.description ?? null,
      belongsToReportingPeriodId: reportingPeriodId,
    });
    return this.repositoryTransactional.save(entry);
  }

  @Transactional()
  async update(
    organizationId: string,
    reportingPeriodId: string,
    id: string,
    dto: CreateEmissionEntryDto,
  ): Promise<EmissionEntry> {
    const entry = await this.findOne(organizationId, reportingPeriodId, id);
    entry.scope = dto.scope;
    entry.category = dto.category;
    entry.source = dto.source;
    entry.value = dto.value;
    entry.unit = dto.unit;
    entry.description = dto.description ?? null;
    return this.repositoryTransactional.save(entry);
  }

  @Transactional()
  async remove(
    organizationId: string,
    reportingPeriodId: string,
    id: string,
  ): Promise<void> {
    const entry = await this.findOne(organizationId, reportingPeriodId, id);
    await this.repositoryTransactional.remove(entry);
  }
}
