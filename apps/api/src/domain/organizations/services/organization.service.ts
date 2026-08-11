import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { TransactionalHandler } from '../../../common/transactional-handler';
import { Organization } from '../organization.entity';
import { CreateOrganizationDto } from '../dtos/organization.dto';

@Injectable()
export class OrganizationService extends TransactionalHandler<Organization> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, Organization);
  }

  @Transactional()
  async findAll(): Promise<Organization[]> {
    return this.repositoryTransactional.find();
  }

  @Transactional()
  async findOne(id: string): Promise<Organization> {
    const organization = await this.repositoryTransactional.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return organization;
  }

  @Transactional()
  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const organization = new Organization({ name: dto.name });
    return this.repositoryTransactional.save(organization);
  }

  @Transactional()
  async update(id: string, dto: CreateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id);
    organization.name = dto.name;
    return this.repositoryTransactional.save(organization);
  }

  @Transactional()
  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    await this.repositoryTransactional.remove(organization);
  }
}
