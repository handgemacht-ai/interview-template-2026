import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IOrganization } from '@interview/common';
import { OrganizationIdentityDto } from '../../../common/dto/identity.dto';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../dtos/organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async findAll(): Promise<IOrganization[]> {
    const organizations = await this.organizationService.findAll();
    return organizations.map((org) => org.toApi());
  }

  @Post()
  async create(@Body() dto: CreateOrganizationDto): Promise<IOrganization> {
    const organization = await this.organizationService.create(dto);
    return organization.toApi();
  }

  @Get(':organizationId')
  async findOne(@Param() params: OrganizationIdentityDto): Promise<IOrganization> {
    const organization = await this.organizationService.findOne(params.organizationId);
    return organization.toApi();
  }

  @Put(':organizationId')
  async update(
    @Param() params: OrganizationIdentityDto,
    @Body() dto: CreateOrganizationDto,
  ): Promise<IOrganization> {
    const organization = await this.organizationService.update(params.organizationId, dto);
    return organization.toApi();
  }

  @Delete(':organizationId')
  async remove(@Param() params: OrganizationIdentityDto): Promise<void> {
    return this.organizationService.remove(params.organizationId);
  }
}
