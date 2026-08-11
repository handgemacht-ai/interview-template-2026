import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EmissionScope } from '@interview/common';

export class CreateEmissionEntryDto {
  @IsEnum(EmissionScope)
  scope: EmissionScope;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsString()
  @IsOptional()
  description?: string;
}
