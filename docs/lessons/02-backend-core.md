# Module 2: Backend Core with NestJS

## Learning Objectives

By the end of this module, you will understand:
- NestJS architecture and modules
- Dependency injection
- Controllers and services
- DTOs and validation
- Guards and authentication
- Error handling

---

## Lesson 2.1: NestJS Architecture

### What is NestJS?

NestJS is a framework for building server-side applications with TypeScript. It uses:
- **Decorators** - Metadata annotations (`@Controller`, `@Injectable`)
- **Modules** - Organizational units
- **Dependency Injection** - Automatic service wiring
- **Express/Fastify** - HTTP layer underneath

### Project Structure

```
backend/src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── auth/                   # Feature module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── entities/
│       └── user.entity.ts
├── accounts/               # Feature module
├── transactions/           # Feature module
└── graphql/                # GraphQL infrastructure
```

### The Module System

Every NestJS app has a root module that imports feature modules:

**File:** `backend/src/app.module.ts`

```typescript
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    TypeOrmModule.forRootAsync({ /* config */ }),

    // Feature modules
    AuthModule,
    HouseholdsModule,
    AccountsModule,
    TransactionsModule,
    BudgetsModule,
    DebtsModule,
    AnalyticsModule,
    PreferencesModule,
    DemoModule,

    // GraphQL
    GraphqlModule,
  ],
})
export class AppModule {}
```

### Feature Module Anatomy

**File:** `backend/src/accounts/accounts.module.ts`

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),  // Register entity
    HouseholdsModule,                      // Import dependencies
  ],
  controllers: [AccountsController],       // HTTP endpoints
  providers: [AccountsService],            // Business logic
  exports: [AccountsService],              // Share with other modules
})
export class AccountsModule {}
```

### Exercise 2.1

Look at `backend/src/budgets/budgets.module.ts`. What entities does it register? What modules does it import?

---

## Lesson 2.2: Dependency Injection

### What is Dependency Injection?

Instead of creating dependencies manually, NestJS automatically provides them:

```typescript
// WITHOUT dependency injection (bad)
class AccountsController {
  private service = new AccountsService(new AccountRepository());
}

// WITH dependency injection (good)
@Controller('accounts')
class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  // NestJS automatically creates and injects AccountsService
}
```

### Injectable Services

**File:** `backend/src/accounts/accounts.service.ts`

```typescript
@Injectable()  // Marks as injectable
export class AccountsService {
  constructor(
    @InjectRepository(Account)  // Inject TypeORM repository
    private accountRepository: Repository<Account>,
  ) {}

  async findAll(householdId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { household: { id: householdId } },
    });
  }
}
```

### Injection Scopes

```typescript
// Default: Singleton (one instance for entire app)
@Injectable()
export class AccountsService {}

// Request scope (new instance per request)
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}
```

### Exercise 2.2

In `backend/src/transactions/transactions.service.ts`:
1. What repositories are injected?
2. What decorator is used for injection?

---

## Lesson 2.3: Controllers (REST API)

### Controller Basics

Controllers handle HTTP requests and return responses:

**File:** `backend/src/accounts/accounts.controller.ts`

```typescript
@Controller('households/:householdId/accounts')  // Base route
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()  // GET /households/:householdId/accounts
  async findAll(@Param('householdId') householdId: string) {
    return this.accountsService.findAll(householdId);
  }

  @Get(':id')  // GET /households/:householdId/accounts/:id
  async findOne(
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ) {
    return this.accountsService.findOne(householdId, id);
  }

  @Post()  // POST /households/:householdId/accounts
  async create(
    @Param('householdId') householdId: string,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(householdId, createAccountDto);
  }
}
```

### HTTP Method Decorators

| Decorator | HTTP Method | Use Case |
|-----------|-------------|----------|
| `@Get()` | GET | Retrieve data |
| `@Post()` | POST | Create new resource |
| `@Put()` | PUT | Replace entire resource |
| `@Patch()` | PATCH | Partial update |
| `@Delete()` | DELETE | Remove resource |

### Parameter Decorators

```typescript
@Get(':id')
async findOne(
  @Param('id') id: string,           // Route parameter
  @Query('include') include: string, // Query string (?include=...)
  @Body() data: CreateDto,           // Request body
  @Headers('authorization') auth: string,  // Header value
  @Req() request: Request,           // Full request object
) {}
```

### Exercise 2.3

Create a mental map of the transactions controller routes. What URL patterns exist?

---

## Lesson 2.4: Services (Business Logic)

### Service Responsibilities

Services contain business logic, separate from HTTP concerns:

**File:** `backend/src/transactions/transactions.service.ts`

```typescript
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
    // 1. Validate account belongs to household
    const account = await this.accountRepository.findOne({
      where: {
        id: createTransactionDto.accountId,
        household: { id: householdId },
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found in this household');
    }

    // 2. Create transaction
    const transaction = this.transactionRepository.create({
      account,
      amount: createTransactionDto.amount,
      category: createTransactionDto.category,
      description: createTransactionDto.description,
      occurredOn: new Date(createTransactionDto.occurredOn),
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // 3. Update account balance (side effect)
    account.balance = Number(account.balance) + Number(createTransactionDto.amount);
    await this.accountRepository.save(account);

    return savedTransaction;
  }
}
```

### Query Builder vs Repository Methods

**Simple queries: Repository methods**

```typescript
// Find all accounts for a household
return this.accountRepository.find({
  where: { household: { id: householdId } },
  order: { name: 'ASC' },
});
```

**Complex queries: Query Builder**

```typescript
// From transactions.service.ts - findAll with filters
const queryBuilder = this.transactionRepository
  .createQueryBuilder('transaction')
  .leftJoinAndSelect('transaction.account', 'account')
  .where('account.household_id = :householdId', { householdId });

if (filters.accountId) {
  queryBuilder.andWhere('transaction.account_id = :accountId', {
    accountId: filters.accountId,
  });
}

if (filters.startDate) {
  queryBuilder.andWhere('transaction.occurred_on >= :startDate', {
    startDate: filters.startDate,
  });
}

const total = await queryBuilder.getCount();
const transactions = await queryBuilder
  .orderBy({ 'transaction.occurred_on': 'DESC' })
  .skip(filters.offset)
  .take(filters.limit)
  .getMany();
```

### Exercise 2.4

Study the `remove` method in `transactions.service.ts`. What happens when a transaction is deleted? Why?

---

## Lesson 2.5: DTOs and Validation

### What are DTOs?

Data Transfer Objects (DTOs) define the shape of data coming into your API:

**File:** `backend/src/transactions/dto/create-transaction.dto.ts`

```typescript
import { IsNotEmpty, IsNumber, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  occurredOn: string;
}
```

### Update DTOs (Partial)

```typescript
// Make all fields optional for updates
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
```

### Validation Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@IsNotEmpty()` | Reject empty values | Required fields |
| `@IsString()` | Must be string | Names, descriptions |
| `@IsNumber()` | Must be number | Amounts, quantities |
| `@IsEmail()` | Valid email format | User emails |
| `@IsUUID()` | Valid UUID | Entity IDs |
| `@IsDateString()` | ISO date string | "2024-01-15" |
| `@Min(0)` | Minimum value | Positive numbers |
| `@MaxLength(255)` | Maximum string length | Names |
| `@IsOptional()` | Field can be missing | Optional fields |

### Global Validation Pipe

**File:** `backend/src/main.ts`

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,         // Strip unknown properties
  forbidNonWhitelisted: true,  // Error on unknown properties
  transform: true,         // Auto-transform types
}));
```

### Exercise 2.5

Create a DTO for a new "goal" feature with:
- `name` (required string, max 100 chars)
- `targetAmount` (required number, min 0)
- `targetDate` (optional date string)

---

## Lesson 2.6: Guards and Authentication

### What are Guards?

Guards determine if a request should be handled:

**File:** `backend/src/graphql/guards/gql-auth.guard.ts`

```typescript
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
```

### JWT Authentication Flow

```
1. User logs in with email/password
2. Server validates and returns JWT token
3. Client stores token (localStorage)
4. Client sends token in Authorization header
5. Guard extracts and validates token
6. Request proceeds if valid
```

### Passport JWT Strategy

**File:** `backend/src/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // This becomes req.user
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
```

### Using Guards

```typescript
// Protect entire controller
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {}

// Protect single route
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### Exercise 2.6

Look at `backend/src/auth/auth.service.ts`. Trace the login flow:
1. How is the password verified?
2. What's included in the JWT payload?
3. When does the token expire?

---

## Lesson 2.7: Error Handling

### Built-in Exceptions

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

// 404 - Resource not found
throw new NotFoundException('Account not found');

// 400 - Invalid input
throw new BadRequestException('Amount must be positive');

// 401 - Not authenticated
throw new UnauthorizedException('Invalid credentials');

// 403 - Not authorized
throw new ForbiddenException('Admin access required');
```

### Exception Pattern in Services

**File:** `backend/src/transactions/transactions.service.ts`

```typescript
async findOne(householdId: string, id: string): Promise<Transaction> {
  const transaction = await this.transactionRepository.findOne({
    where: { id },
    relations: ['account'],
  });

  // Check existence AND authorization
  if (!transaction || transaction.account.household?.id !== householdId) {
    throw new NotFoundException('Transaction not found');
  }

  return transaction;
}
```

### Custom Exception Filters

```typescript
@Catch(QueryFailedError)  // TypeORM errors
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.message.includes('duplicate key')) {
      return response.status(409).json({
        statusCode: 409,
        message: 'Resource already exists',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Database error',
    });
  }
}
```

### Exercise 2.7

Add proper error handling to this code:

```typescript
async updateBalance(accountId: string, amount: number) {
  const account = await this.accountRepository.findOne({ where: { id: accountId } });
  account.balance = account.balance + amount;  // What if account is null?
  return this.accountRepository.save(account);
}
```

---

## Lesson 2.8: Application Bootstrap

### Main Entry Point

**File:** `backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Start server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### Running the Backend

```bash
cd backend

# Development (hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

---

## Module Summary

### Key Takeaways

1. **Modules organize features** - Each feature has its own module
2. **Dependency injection wires services** - NestJS handles instantiation
3. **Controllers handle HTTP** - Route mapping and request handling
4. **Services contain business logic** - Reusable across controllers/resolvers
5. **DTOs validate input** - class-validator decorators
6. **Guards protect routes** - Authentication and authorization

### Files to Study

| File | Concepts |
|------|----------|
| `app.module.ts` | Root module, imports |
| `accounts.module.ts` | Feature module |
| `accounts.controller.ts` | REST endpoints |
| `transactions.service.ts` | Complex business logic |
| `create-transaction.dto.ts` | Validation |
| `main.ts` | Bootstrap, CORS, validation |

### Practice Exercises

1. Add a new endpoint `GET /accounts/summary` that returns total balance
2. Create a filter DTO for accounts with `type` parameter
3. Add a guard that checks if user is household admin
4. Add error handling for duplicate budget categories

---

**Next Module:** [GraphQL Implementation](./03-graphql-backend.md)
