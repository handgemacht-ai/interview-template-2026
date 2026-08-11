import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { TransactionalHandler } from '../../../common/transactional-handler';
import { ReportingPeriod } from '../reporting-period.entity';
import { CreateReportingPeriodDto } from '../dtos/reporting-period.dto';
import { OrganizationService } from '../../organizations/services/organization.service';

@Injectable()
export class ReportingPeriodService extends TransactionalHandler<ReportingPeriod> {
  constructor(
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
    private readonly organizationService: OrganizationService,
  ) {
    super(txHost, ReportingPeriod);
  }

  @Transactional()
  async findAll(organizationId: string): Promise<ReportingPeriod[]> {
    await this.organizationService.findOne(organizationId);
    return this.repositoryTransactional.find({
      where: { belongsToOrganizationId: organizationId },
    });
  }

  @Transactional()
  async findOne(organizationId: string, id: string): Promise<ReportingPeriod> {
    await this.organizationService.findOne(organizationId);
    const reportingPeriod = await this.repositoryTransactional.findOne({
      where: { id, belongsToOrganizationId: organizationId },
    });
    if (!reportingPeriod) {
      throw new NotFoundException(`Reporting period with id ${id} not found`);
    }
    return reportingPeriod;
  }

  @Transactional()
  async create(organizationId: string, dto: CreateReportingPeriodDto): Promise<ReportingPeriod> {
    await this.organizationService.findOne(organizationId);
    const reportingPeriod = new ReportingPeriod({
      year: dto.year,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      belongsToOrganizationId: organizationId,
    });
    return this.repositoryTransactional.save(reportingPeriod);
  }

  @Transactional()
  async update(
    organizationId: string,
    id: string,
    dto: CreateReportingPeriodDto,
  ): Promise<ReportingPeriod> {
    const reportingPeriod = await this.findOne(organizationId, id);
    reportingPeriod.year = dto.year;
    reportingPeriod.startDate = new Date(dto.startDate);
    reportingPeriod.endDate = new Date(dto.endDate);
    return this.repositoryTransactional.save(reportingPeriod);
  }

  @Transactional()
  async remove(organizationId: string, id: string): Promise<void> {
    const reportingPeriod = await this.findOne(organizationId, id);
    await this.repositoryTransactional.remove(reportingPeriod);
  }
}
