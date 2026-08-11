import { Entity, Column, OneToMany } from 'typeorm';
import { IOrganization } from '@interview/common';
import { BaseEntity } from '../../common/entities/base.entity';
import { ReportingPeriod } from '../reporting-periods/reporting-period.entity';

@Entity('organizations')
export class Organization extends BaseEntity implements IOrganization {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => ReportingPeriod, (rp) => rp.organization)
  reportingPeriods: ReportingPeriod[];

  constructor(partial: Partial<Organization>) {
    super();
    Object.assign(this, partial);
  }

  toApi(): IOrganization {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
