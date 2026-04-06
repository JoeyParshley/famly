import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PayoffRequestDto } from './dto/payoff-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households/:householdId/debts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @Roles(HouseholdRole.EDIT)
  create(
    @Param('householdId') householdId: string,
    @Body() createDebtDto: CreateDebtDto,
  ) {
    return this.debtsService.create(householdId, createDebtDto);
  }

  @Get()
  @Roles(HouseholdRole.VIEW)
  findAll(@Param('householdId') householdId: string) {
    return this.debtsService.findAll(householdId);
  }

  @Get('summary')
  @Roles(HouseholdRole.VIEW)
  getSummary(@Param('householdId') householdId: string) {
    return this.debtsService.getDebtSummary(householdId);
  }

  @Post('payoff')
  @Roles(HouseholdRole.VIEW)
  getPayoffScenario(
    @Param('householdId') householdId: string,
    @Body() request: PayoffRequestDto,
  ) {
    return this.debtsService.getPayoffScenario(householdId, request);
  }

  @Get('compare-strategies')
  @Roles(HouseholdRole.VIEW)
  compareStrategies(
    @Param('householdId') householdId: string,
    @Query('extraPayment') extraPayment?: number,
  ) {
    return this.debtsService.compareStrategies(
      householdId,
      extraPayment ? Number(extraPayment) : 0,
    );
  }

  @Get(':id')
  @Roles(HouseholdRole.VIEW)
  findOne(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.debtsService.findOne(householdId, id);
  }

  @Post(':id/payoff')
  @Roles(HouseholdRole.VIEW)
  getSingleDebtPayoff(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() request: PayoffRequestDto,
  ) {
    return this.debtsService.getSingleDebtPayoff(householdId, id, request);
  }

  @Patch(':id')
  @Roles(HouseholdRole.EDIT)
  update(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    return this.debtsService.update(householdId, id, updateDebtDto);
  }

  @Delete(':id')
  @Roles(HouseholdRole.EDIT)
  remove(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.debtsService.remove(householdId, id);
  }
}
