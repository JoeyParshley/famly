import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households/:householdId/accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(HouseholdRole.EDIT)
  create(
    @Param('householdId') householdId: string,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(householdId, createAccountDto);
  }

  @Get()
  @Roles(HouseholdRole.VIEW)
  findAll(@Param('householdId') householdId: string) {
    return this.accountsService.findAll(householdId);
  }

  @Get('summary')
  @Roles(HouseholdRole.VIEW)
  getNetWorth(@Param('householdId') householdId: string) {
    return this.accountsService.getNetWorth(householdId);
  }

  @Get(':id')
  @Roles(HouseholdRole.VIEW)
  findOne(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.accountsService.findOne(householdId, id);
  }

  @Patch(':id')
  @Roles(HouseholdRole.EDIT)
  update(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(householdId, id, updateAccountDto);
  }

  @Delete(':id')
  @Roles(HouseholdRole.EDIT)
  remove(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.accountsService.remove(householdId, id);
  }
}
