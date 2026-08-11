import { IsInt, IsDateString, Min } from 'class-validator';

export class CreateReportingPeriodDto {
  @IsInt()
  @Min(2000)
  year: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
