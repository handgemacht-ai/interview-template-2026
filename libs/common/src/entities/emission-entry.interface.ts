import { EmissionScope } from '../enums/emission-scope.enum.js';

export interface IEmissionEntry {
  id: string;
  reportingPeriodId: string;
  scope: EmissionScope;
  category: string;
  source: string;
  value: number;
  unit: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
