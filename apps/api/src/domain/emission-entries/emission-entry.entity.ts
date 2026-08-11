import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IEmissionEntry, EmissionScope } from '@interview/common';
import { BaseEntity } from '../../common/entities/base.entity';
import { ReportingPeriod } from '../reporting-periods/reporting-period.entity';

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => parseFloat(value),
};

@Entity('emission_entries')
export class EmissionEntry extends BaseEntity implements IEmissionEntry {
  @Column({ type: 'enum', enum: EmissionScope })
  scope: EmissionScope;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  source: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, transformer: numericTransformer })
  value: number;

  @Column({ type: 'varchar', nullable: false })
  unit: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'uuid' })
  belongsToReportingPeriodId: string;

  @ManyToOne(() => ReportingPeriod, (rp) => rp.emissionEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'belongs_to_reporting_period_id' })
  reportingPeriod: ReportingPeriod;

  get reportingPeriodId(): string {
    return this.belongsToReportingPeriodId;
  }

  constructor(partial: Partial<EmissionEntry>) {
    super();
    Object.assign(this, partial);
  }

  toApi(): IEmissionEntry {
    return {
      id: this.id,
      reportingPeriodId: this.belongsToReportingPeriodId,
      scope: this.scope,
      category: this.category,
      source: this.source,
      value: this.value,
      unit: this.unit,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
