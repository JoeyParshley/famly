import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(
    householdId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const account = await this.accountRepository.findOne({
      where: {
        id: createTransactionDto.accountId,
        household: { id: householdId },
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found in this household');
    }

    const transaction = this.transactionRepository.create({
      account,
      amount: createTransactionDto.amount,
      category: createTransactionDto.category,
      description: createTransactionDto.description,
      occurredOn: new Date(createTransactionDto.occurredOn),
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balance
    account.balance = Number(account.balance) + Number(createTransactionDto.amount);
    await this.accountRepository.save(account);

    return savedTransaction;
  }

  async findAll(
    householdId: string,
    filters: FilterTransactionsDto,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.household_id = :householdId', { householdId });

    if (filters.accountId) {
      queryBuilder.andWhere('transaction.account_id = :accountId', {
        accountId: filters.accountId,
      });
    }

    if (filters.category) {
      queryBuilder.andWhere('transaction.category = :category', {
        category: filters.category,
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('transaction.occurred_on >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('transaction.occurred_on <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const total = await queryBuilder.getCount();

    const transactions = await queryBuilder
      .orderBy({
        'transaction.occurred_on': 'DESC',
        'transaction.created_at': 'DESC',
      })
      .skip(filters.offset)
      .take(filters.limit)
      .getMany();

    return { transactions, total };
  }

  async findOne(householdId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction || transaction.account.household?.id !== householdId) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    householdId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'account.household'],
    });

    if (!transaction || transaction.account.household?.id !== householdId) {
      throw new NotFoundException('Transaction not found');
    }

    const oldAmount = Number(transaction.amount);
    let newAccount = transaction.account;

    // If changing account, verify the new account belongs to the household
    if (
      updateTransactionDto.accountId &&
      updateTransactionDto.accountId !== transaction.account.id
    ) {
      const foundAccount = await this.accountRepository.findOne({
        where: {
          id: updateTransactionDto.accountId,
          household: { id: householdId },
        },
      });

      if (!foundAccount) {
        throw new BadRequestException('New account not found in this household');
      }

      newAccount = foundAccount;

      // Reverse the old account balance
      transaction.account.balance = Number(transaction.account.balance) - oldAmount;
      await this.accountRepository.save(transaction.account);

      transaction.account = newAccount;
    }

    // Update transaction fields
    if (updateTransactionDto.amount !== undefined) {
      transaction.amount = updateTransactionDto.amount;
    }
    if (updateTransactionDto.category !== undefined) {
      transaction.category = updateTransactionDto.category;
    }
    if (updateTransactionDto.description !== undefined) {
      transaction.description = updateTransactionDto.description;
    }
    if (updateTransactionDto.occurredOn !== undefined) {
      transaction.occurredOn = new Date(updateTransactionDto.occurredOn);
    }

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balance with new amount
    const newAmount = Number(transaction.amount);
    if (
      updateTransactionDto.accountId &&
      updateTransactionDto.accountId !== transaction.account.id
    ) {
      // New account gets the new amount
      newAccount.balance = Number(newAccount.balance) + newAmount;
    } else {
      // Same account: adjust by the difference
      newAccount.balance = Number(newAccount.balance) - oldAmount + newAmount;
    }
    await this.accountRepository.save(newAccount);

    return savedTransaction;
  }

  async remove(householdId: string, id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'account.household'],
    });

    if (!transaction || transaction.account.household?.id !== householdId) {
      throw new NotFoundException('Transaction not found');
    }

    // Reverse the account balance
    transaction.account.balance =
      Number(transaction.account.balance) - Number(transaction.amount);
    await this.accountRepository.save(transaction.account);

    await this.transactionRepository.remove(transaction);
  }

  async getCategories(householdId: string): Promise<string[]> {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DISTINCT transaction.category', 'category')
      .leftJoin('transaction.account', 'account')
      .where('account.household_id = :householdId', { householdId })
      .orderBy('category', 'ASC')
      .getRawMany();

    return result.map((r) => r.category);
  }

  async getRecentTransactions(
    householdId: string,
    limit: number = 10,
  ): Promise<Transaction[]> {
    // Get account IDs for this household first
    const accounts = await this.accountRepository.find({
      where: { household: { id: householdId } },
      select: ['id'],
    });

    const accountIds = accounts.map(a => a.id);

    if (accountIds.length === 0) {
      return [];
    }

    return this.transactionRepository.find({
      where: { account: { id: In(accountIds) } },
      relations: ['account'],
      order: { occurredOn: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }
}
