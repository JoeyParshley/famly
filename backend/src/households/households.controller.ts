import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HouseholdsService } from './households.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households')
@UseGuards(JwtAuthGuard)
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

  @Post()
  create(@Body() createHouseholdDto: CreateHouseholdDto, @Request() req) {
    return this.householdsService.create(createHouseholdDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.householdsService.findAllForUser(req.user.id);
  }

  @Get(':householdId')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.VIEW)
  findOne(@Param('householdId') id: string, @Request() req) {
    return this.householdsService.findOne(id, req.user.id);
  }

  @Patch(':householdId')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.ADMIN)
  update(
    @Param('householdId') id: string,
    @Body() updateHouseholdDto: UpdateHouseholdDto,
  ) {
    return this.householdsService.update(id, updateHouseholdDto);
  }

  @Delete(':householdId')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.ADMIN)
  remove(@Param('householdId') id: string) {
    return this.householdsService.remove(id);
  }

  @Get(':householdId/members')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.VIEW)
  getMembers(@Param('householdId') householdId: string) {
    return this.householdsService.getMembers(householdId);
  }

  @Post(':householdId/members')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.ADMIN)
  addMember(
    @Param('householdId') householdId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.householdsService.addMember(householdId, addMemberDto);
  }

  @Patch(':householdId/members/:memberId')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.ADMIN)
  updateMemberRole(
    @Param('householdId') householdId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateMemberRoleDto,
    @Request() req,
  ) {
    return this.householdsService.updateMemberRole(
      householdId,
      memberId,
      updateDto,
      req.user.id,
    );
  }

  @Delete(':householdId/members/:memberId')
  @UseGuards(RolesGuard)
  @Roles(HouseholdRole.ADMIN)
  removeMember(
    @Param('householdId') householdId: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    return this.householdsService.removeMember(householdId, memberId, req.user.id);
  }
}
