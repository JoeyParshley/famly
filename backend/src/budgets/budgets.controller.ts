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
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households/:householdId/budgets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @Roles(HouseholdRole.EDIT)
  create(
    @Param('householdId') householdId: string,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetsService.create(householdId, createBudgetDto);
  }

  @Get()
  @Roles(HouseholdRole.VIEW)
  findAll(@Param('householdId') householdId: string) {
    return this.budgetsService.findAll(householdId);
  }

  @Get('with-spending')
  @Roles(HouseholdRole.VIEW)
  getBudgetsWithSpending(
    @Param('householdId') householdId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.budgetsService.getBudgetsWithSpending(
      householdId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('summary')
  @Roles(HouseholdRole.VIEW)
  getBudgetSummary(@Param('householdId') householdId: string) {
    return this.budgetsService.getBudgetSummary(householdId);
  }

  @Get(':id')
  @Roles(HouseholdRole.VIEW)
  findOne(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.findOne(householdId, id);
  }

  @Patch(':id')
  @Roles(HouseholdRole.EDIT)
  update(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(householdId, id, updateBudgetDto);
  }

  @Delete(':id')
  @Roles(HouseholdRole.EDIT)
  remove(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.remove(householdId, id);
  }
}
