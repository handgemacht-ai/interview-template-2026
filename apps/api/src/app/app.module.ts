import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { OrganizationModule } from '../domain/organizations/organization.module';
import { ReportingPeriodModule } from '../domain/reporting-periods/reporting-period.module';
import { EmissionEntryModule } from '../domain/emission-entries/emission-entry.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'interview',
      password: 'interview',
      database: 'interview',
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: DataSource,
          }),
        }),
      ],
    }),
    OrganizationModule,
    ReportingPeriodModule,
    EmissionEntryModule,
  ],
})
export class AppModule {}
