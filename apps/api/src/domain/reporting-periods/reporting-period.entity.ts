import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IReportingPeriod } from '@interview/common';
import { BaseEntity } from '../../common/entities/base.entity';
import { Organization } from '../organizations/organization.entity';
import { EmissionEntry } from '../emission-entries/emission-entry.entity';

@Entity('reporting_periods')
export class ReportingPeriod extends BaseEntity implements IReportingPeriod {
  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  endDate: Date;

  @Column({ type: 'uuid' })
  belongsToOrganizationId: string;

  @ManyToOne(() => Organization, (org) => org.reportingPeriods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'belongs_to_organization_id' })
  organization: Organization;

  @OneToMany(() => EmissionEntry, (entry) => entry.reportingPeriod)
  emissionEntries: EmissionEntry[];

  get organizationId(): string {
    return this.belongsToOrganizationId;
  }

  constructor(partial: Partial<ReportingPeriod>) {
    super();
    Object.assign(this, partial);
  }

  toApi(): IReportingPeriod {
    return {
      id: this.id,
      organizationId: this.belongsToOrganizationId,
      year: this.year,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
