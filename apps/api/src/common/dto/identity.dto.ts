import { IsUUID } from 'class-validator';

export class OrganizationIdentityDto {
  @IsUUID()
  organizationId: string;
}

export class ReportingPeriodIdentityDto extends OrganizationIdentityDto {
  @IsUUID()
  reportingPeriodId: string;
}

export class EmissionEntryIdentityDto extends ReportingPeriodIdentityDto {
  @IsUUID()
  emissionEntryId: string;
}
