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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HouseholdRole } from '../common/enums/role.enum';

@Controller('api/households/:householdId/transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(HouseholdRole.EDIT)
  create(
    @Param('householdId') householdId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(householdId, createTransactionDto);
  }

  @Get()
  @Roles(HouseholdRole.VIEW)
  findAll(
    @Param('householdId') householdId: string,
    @Query() filters: FilterTransactionsDto,
  ) {
    return this.transactionsService.findAll(householdId, filters);
  }

  @Get('categories')
  @Roles(HouseholdRole.VIEW)
  getCategories(@Param('householdId') householdId: string) {
    return this.transactionsService.getCategories(householdId);
  }

  @Get('recent')
  @Roles(HouseholdRole.VIEW)
  getRecent(
    @Param('householdId') householdId: string,
    @Query('limit') limit?: number,
  ) {
    return this.transactionsService.getRecentTransactions(
      householdId,
      limit || 10,
    );
  }

  @Get(':id')
  @Roles(HouseholdRole.VIEW)
  findOne(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.findOne(householdId, id);
  }

  @Patch(':id')
  @Roles(HouseholdRole.EDIT)
  update(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(householdId, id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles(HouseholdRole.EDIT)
  remove(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.remove(householdId, id);
  }
}
