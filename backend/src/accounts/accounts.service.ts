import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Household } from '../households/entities/household.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
  ) {}

  async create(
    householdId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const account = this.accountRepository.create({
      ...createAccountDto,
      household,
    });

    return this.accountRepository.save(account);
  }

  async findAll(householdId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { household: { id: householdId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(householdId: string, id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, household: { id: householdId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(
    householdId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(householdId, id);
    Object.assign(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  async remove(householdId: string, id: string): Promise<void> {
    const account = await this.findOne(householdId, id);
    await this.accountRepository.remove(account);
  }

  async getAccountsByType(
    householdId: string,
    type: string,
  ): Promise<Account[]> {
    return this.accountRepository.find({
      where: { household: { id: householdId }, type },
    });
  }

  async getTotalBalance(householdId: string): Promise<number> {
    const result = await this.accountRepository
      .createQueryBuilder('account')
      .select('SUM(account.balance)', 'total')
      .where('account.household_id = :householdId', { householdId })
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getNetWorth(householdId: string): Promise<{
    assets: number;
    liabilities: number;
    netWorth: number;
  }> {
    const accounts = await this.findAll(householdId);

    const assets = accounts
      .filter((a) => a.balance > 0)
      .reduce((sum, a) => sum + Number(a.balance), 0);

    const liabilities = accounts
      .filter((a) => a.balance < 0)
      .reduce((sum, a) => sum + Math.abs(Number(a.balance)), 0);

    return {
      assets,
      liabilities,
      netWorth: assets - liabilities,
    };
  }
}
