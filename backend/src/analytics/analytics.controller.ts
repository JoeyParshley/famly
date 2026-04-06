import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PurchaseImpactDto } from './dto/purchase-impact.dto';
import { CreatePaydayDto } from './dto/create-payday.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households/:householdId/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('spending')
  @Roles(HouseholdRole.VIEW)
  getSpendingByCategory(
    @Param('householdId') householdId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getSpendingByCategory(
      householdId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('trends')
  @Roles(HouseholdRole.VIEW)
  getBalanceTrends(
    @Param('householdId') householdId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getBalanceTrends(householdId, days || 30);
  }

  @Get('income-expense')
  @Roles(HouseholdRole.VIEW)
  getIncomeExpenseTrends(
    @Param('householdId') householdId: string,
    @Query('months') months?: number,
  ) {
    return this.analyticsService.getIncomeExpenseTrends(householdId, months || 6);
  }

  @Post('purchase-impact')
  @Roles(HouseholdRole.VIEW)
  simulatePurchaseImpact(
    @Param('householdId') householdId: string,
    @Body() dto: PurchaseImpactDto,
    @Query('threshold') threshold: number,
    @Request() req,
  ) {
    return this.analyticsService.simulatePurchaseImpact(
      householdId,
      req.user.id,
      dto,
      threshold || 500,
    );
  }

  @Get('dashboard')
  @Roles(HouseholdRole.VIEW)
  getDashboardSummary(@Param('householdId') householdId: string) {
    return this.analyticsService.getDashboardSummary(householdId);
  }

  // Payday endpoints
  @Get('paydays')
  @Roles(HouseholdRole.VIEW)
  getPaydays(@Param('householdId') householdId: string) {
    return this.analyticsService.getPaydays(householdId);
  }

  @Post('paydays')
  @Roles(HouseholdRole.EDIT)
  createPayday(
    @Param('householdId') householdId: string,
    @Body() dto: CreatePaydayDto,
  ) {
    return this.analyticsService.createPayday(householdId, dto);
  }

  @Delete('paydays/:paydayId')
  @Roles(HouseholdRole.EDIT)
  deletePayday(
    @Param('householdId') householdId: string,
    @Param('paydayId') paydayId: string,
  ) {
    return this.analyticsService.deletePayday(householdId, paydayId);
  }
}
