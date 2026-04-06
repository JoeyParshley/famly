# Module 3: GraphQL Backend Implementation

## Learning Objectives

By the end of this module, you will understand:
- GraphQL concepts vs REST
- NestJS code-first approach
- Object types and input types
- Resolvers (queries and mutations)
- Authentication in GraphQL
- Field resolvers and nested data

---

## Lesson 3.1: GraphQL Fundamentals

### What is GraphQL?

GraphQL is a query language for APIs that lets clients request exactly the data they need.

### GraphQL vs REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple (`/users`, `/accounts`) | Single (`/graphql`) |
| Data fetching | Fixed response shape | Client specifies fields |
| Over-fetching | Common | Eliminated |
| Under-fetching | Requires multiple requests | One request |
| Versioning | URL versioning (`/v1/users`) | Schema evolution |

### GraphQL Operations

```graphql
# Query - Read data
query {
  accounts {
    id
    name
    balance
  }
}

# Mutation - Write data
mutation {
  createAccount(input: { name: "Savings", type: SAVINGS }) {
    id
    name
  }
}

# Subscription - Real-time updates (not used in Famly)
subscription {
  transactionCreated {
    id
    amount
  }
}
```

### Exercise 3.1

Compare these approaches to get a user's accounts and recent transactions:

**REST:**
```
GET /users/me
GET /households/abc123/accounts
GET /households/abc123/transactions?limit=5
```

**GraphQL:**
```graphql
query {
  me {
    households {
      accounts { id name balance }
      recentTransactions(limit: 5) { id amount }
    }
  }
}
```

Which is more efficient? Why?

---

## Lesson 3.2: NestJS Code-First Approach

### Schema Generation

NestJS generates GraphQL schema from TypeScript classes:

**File:** `backend/src/graphql/graphql.module.ts`

```typescript
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',  // Auto-generate schema
      sortSchema: true,               // Alphabetical order
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      context: ({ req, res }) => ({ req, res }),  // Pass request to resolvers
    }),
  ],
  providers: [DateScalar],
})
export class GraphqlModule {}
```

### Generated Schema

**File:** `backend/schema.gql` (auto-generated)

```graphql
type Account {
  id: ID!
  name: String!
  type: AccountType!
  balance: Float!
  institution: String
  interestRate: Float
  createdAt: DateTime!
}

type Query {
  accounts(householdId: ID!): [Account!]!
  account(householdId: ID!, id: ID!): Account!
}

type Mutation {
  createAccount(householdId: ID!, input: CreateAccountInput!): Account!
}
```

### Exercise 3.2

Open `backend/schema.gql` and find:
1. All query fields
2. All mutation fields
3. The shape of `TransactionConnection`

---

## Lesson 3.3: Object Types (Models)

### Defining a GraphQL Type

**File:** `backend/src/accounts/graphql/account.model.ts`

```typescript
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { AccountType } from '../../graphql/enums';

@ObjectType()  // This becomes a GraphQL type
export class AccountModel {
  @Field(() => ID)  // GraphQL ID scalar
  id: string;

  @Field()  // String by default
  name: string;

  @Field(() => AccountType)  // Custom enum
  type: AccountType;

  @Field(() => Float)  // Explicit Float
  balance: number;

  @Field({ nullable: true })  // Optional field
  institution?: string;

  @Field(() => Float, { nullable: true })
  interestRate?: number;

  @Field()
  createdAt: Date;
}
```

### Complex Types

**File:** `backend/src/analytics/graphql/analytics.model.ts`

```typescript
@ObjectType()
export class DashboardSummary {
  @Field(() => Float)
  totalBalance: number;

  @Field(() => Float)
  monthlyIncome: number;

  @Field(() => Float)
  monthlyExpenses: number;

  @Field(() => Float)
  savingsRate: number;

  @Field(() => [TopCategory])  // Array of objects
  topSpendingCategories: TopCategory[];
}

@ObjectType()
export class TopCategory {
  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  percentage: number;
}
```

### GraphQL Scalars

| TypeScript | GraphQL | Decorator |
|------------|---------|-----------|
| `string` | `String` | `@Field()` |
| `number` | `Float` | `@Field(() => Float)` |
| `number` | `Int` | `@Field(() => Int)` |
| `boolean` | `Boolean` | `@Field()` |
| `string` (id) | `ID` | `@Field(() => ID)` |
| `Date` | Custom | `@Field()` with DateScalar |

### Custom Date Scalar

**File:** `backend/src/graphql/scalars/date.scalar.ts`

```typescript
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime')
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value);  // From client
  }

  serialize(value: Date): string {
    return value.toISOString();  // To client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
```

### Exercise 3.3

Create an object type for `Goal` with:
- id (ID)
- name (String)
- targetAmount (Float)
- currentAmount (Float)
- targetDate (Date, optional)
- completed (Boolean)

---

## Lesson 3.4: Input Types

### Defining Input Types

Inputs define the shape of mutation arguments:

**File:** `backend/src/accounts/graphql/account.input.ts`

```typescript
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength, Min, Max } from 'class-validator';
import { AccountType } from '../../graphql/enums';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Field(() => AccountType)
  @IsNotEmpty()
  type: AccountType;

  @Field(() => Float, { defaultValue: 0 })
  @Min(0)
  balance: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  institution?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;
}

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @Field(() => AccountType, { nullable: true })
  @IsOptional()
  type?: AccountType;

  // All fields optional for updates
}
```

### Filter Input Types

**File:** `backend/src/transactions/graphql/transaction.input.ts`

```typescript
@InputType()
export class TransactionFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Int, { defaultValue: 50 })
  @Min(1)
  @Max(100)
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  offset: number;
}
```

### Exercise 3.4

Why do we use `@InputType()` instead of `@ObjectType()` for mutation arguments? What's the difference?

---

## Lesson 3.5: Enums

### Registering GraphQL Enums

**File:** `backend/src/graphql/enums.ts`

```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT = 'credit',
  INVESTMENT = 'investment',
  CASH = 'cash',
}

export enum HouseholdRole {
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}

export enum PayoffStrategy {
  AVALANCHE = 'avalanche',  // Highest interest first
  SNOWBALL = 'snowball',    // Smallest balance first
}

// Register for GraphQL schema
registerEnumType(AccountType, {
  name: 'AccountType',
  description: 'Type of financial account',
});

registerEnumType(HouseholdRole, {
  name: 'HouseholdRole',
  description: 'Member role within a household',
});

registerEnumType(PayoffStrategy, {
  name: 'PayoffStrategy',
  description: 'Debt payoff strategy',
});
```

### Using Enums

```typescript
// In input type
@Field(() => AccountType)
type: AccountType;

// In object type
@Field(() => HouseholdRole)
role: HouseholdRole;
```

---

## Lesson 3.6: Resolvers - Queries

### Query Resolver

**File:** `backend/src/accounts/graphql/accounts.resolver.ts`

```typescript
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { AccountModel, AccountsSummary } from './account.model';
import { AccountsService } from '../accounts.service';

@Resolver(() => AccountModel)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => [AccountModel])
  @UseGuards(GqlAuthGuard)  // Require authentication
  async accounts(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<AccountModel[]> {
    const accounts = await this.accountsService.findAll(householdId);

    // Map entity to GraphQL model
    return accounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type as any,  // Entity enum to GraphQL enum
      balance: Number(a.balance),
      institution: a.institution,
      interestRate: a.interestRate ? Number(a.interestRate) : undefined,
      createdAt: a.createdAt,
    }));
  }

  @Query(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async account(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AccountModel> {
    const account = await this.accountsService.findOne(householdId, id);
    // Map and return...
  }

  @Query(() => AccountsSummary)
  @UseGuards(GqlAuthGuard)
  async accountsSummary(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<AccountsSummary> {
    return this.accountsService.getSummary(householdId);
  }
}
```

### Calling from GraphQL Playground

```graphql
query GetAccounts {
  accounts(householdId: "abc-123") {
    id
    name
    type
    balance
  }
}

query GetAccountsSummary {
  accountsSummary(householdId: "abc-123") {
    totalBalance
    totalAssets
    totalLiabilities
    netWorth
  }
}
```

### Exercise 3.5

Look at `transactions.resolver.ts`. How does the `transactions` query handle:
1. Filtering by account?
2. Pagination?
3. Date ranges?

---

## Lesson 3.7: Resolvers - Mutations

### Mutation Resolver

**File:** `backend/src/accounts/graphql/accounts.resolver.ts`

```typescript
import { Mutation, Args, ID } from '@nestjs/graphql';

@Resolver(() => AccountModel)
export class AccountsResolver {
  // ... queries above ...

  @Mutation(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async createAccount(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('input') input: CreateAccountInput,
  ): Promise<AccountModel> {
    const account = await this.accountsService.create(householdId, {
      name: input.name,
      type: input.type,
      balance: input.balance,
      institution: input.institution,
      interestRate: input.interestRate,
    });

    return {
      id: account.id,
      name: account.name,
      type: account.type as any,
      balance: Number(account.balance),
      institution: account.institution,
      interestRate: account.interestRate ? Number(account.interestRate) : undefined,
      createdAt: account.createdAt,
    };
  }

  @Mutation(() => AccountModel)
  @UseGuards(GqlAuthGuard)
  async updateAccount(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAccountInput,
  ): Promise<AccountModel> {
    const account = await this.accountsService.update(householdId, id, input);
    // Map and return...
  }

  @Mutation(() => Boolean)  // Return simple boolean
  @UseGuards(GqlAuthGuard)
  async deleteAccount(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.accountsService.remove(householdId, id);
    return true;
  }
}
```

### Calling Mutations

```graphql
mutation CreateAccount {
  createAccount(
    householdId: "abc-123"
    input: {
      name: "Emergency Fund"
      type: SAVINGS
      balance: 5000
      institution: "Ally Bank"
      interestRate: 4.25
    }
  ) {
    id
    name
    balance
  }
}

mutation DeleteAccount {
  deleteAccount(householdId: "abc-123", id: "acc-456")
}
```

### Exercise 3.6

Study the `debts.resolver.ts` mutations. What happens when a debt is created? Updated?

---

## Lesson 3.8: GraphQL Authentication

### Auth Guard for GraphQL

**File:** `backend/src/graphql/guards/gql-auth.guard.ts`

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Convert GraphQL context to Express request
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
```

### Current User Decorator

**File:** `backend/src/graphql/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
```

### Using in Resolvers

```typescript
@Query(() => UserModel)
@UseGuards(GqlAuthGuard)
async me(@CurrentUser() user: { id: string; email: string; name: string }) {
  return this.authService.getProfile(user.id);
}
```

### Auth Resolver

**File:** `backend/src/auth/graphql/auth.resolver.ts`

```typescript
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const result = await this.authService.login(input.email, input.password);
    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        createdAt: result.user.createdAt,
        isDemo: result.user.isDemo,
      },
    };
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any): Promise<UserModel> {
    const fullUser = await this.authService.getProfile(user.id);
    return {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      createdAt: fullUser.createdAt,
      isDemo: fullUser.isDemo,
    };
  }
}
```

### Exercise 3.7

How would you add role-based authorization to ensure only admins can delete accounts?

---

## Lesson 3.9: Field Resolvers

### Nested Data Resolution

**File:** `backend/src/households/graphql/households.resolver.ts`

```typescript
@Resolver(() => HouseholdModel)
export class HouseholdsResolver {
  constructor(
    private householdsService: HouseholdsService,
    private accountsService: AccountsService,
  ) {}

  @Query(() => HouseholdModel)
  @UseGuards(GqlAuthGuard)
  async household(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<HouseholdModel> {
    return this.householdsService.findOne(id, user.id);
  }

  // Field resolver: called when 'accounts' field is requested
  @ResolveField(() => [AccountModel])
  async accounts(@Parent() household: HouseholdModel): Promise<AccountModel[]> {
    const accounts = await this.accountsService.findAll(household.id);
    return accounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type as any,
      balance: Number(a.balance),
      institution: a.institution,
      interestRate: a.interestRate ? Number(a.interestRate) : undefined,
      createdAt: a.createdAt,
    }));
  }
}
```

### How Field Resolvers Work

```graphql
# This query triggers field resolution
query {
  household(id: "abc") {
    id
    name
    accounts {      # <-- Field resolver called
      id
      balance
    }
  }
}

# If accounts not requested, field resolver NOT called
query {
  household(id: "abc") {
    id
    name
    # No accounts field = no extra query
  }
}
```

### Exercise 3.8

Add a field resolver to `HouseholdModel` that returns total debt across all accounts.

---

## Lesson 3.10: Pagination Pattern

### Connection Pattern

**File:** `backend/src/transactions/graphql/transaction-connection.model.ts`

```typescript
@ObjectType()
export class TransactionConnection {
  @Field(() => [TransactionModel])
  items: TransactionModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;

  @Field()
  hasMore: boolean;
}
```

### Paginated Query

```typescript
@Query(() => TransactionConnection)
@UseGuards(GqlAuthGuard)
async transactions(
  @Args('householdId', { type: () => ID }) householdId: string,
  @Args('filters', { nullable: true }) filters?: TransactionFilterInput,
): Promise<TransactionConnection> {
  const result = await this.transactionsService.findAll(
    householdId,
    filters || {},
  );

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  return {
    items: result.transactions.map(t => ({ /* map to model */ })),
    total: result.total,
    limit,
    offset,
    hasMore: offset + result.transactions.length < result.total,
  };
}
```

### Using Pagination

```graphql
query GetTransactions {
  transactions(
    householdId: "abc-123"
    filters: { limit: 20, offset: 0, category: "groceries" }
  ) {
    items {
      id
      amount
      description
    }
    total
    hasMore
  }
}
```

---

## Module Summary

### Key Takeaways

1. **GraphQL uses a single endpoint** - Clients request specific fields
2. **Code-first generates schema** - TypeScript classes become GraphQL types
3. **ObjectTypes for responses** - `@ObjectType()` decorator
4. **InputTypes for arguments** - `@InputType()` decorator with validation
5. **Resolvers handle operations** - `@Query()` and `@Mutation()` decorators
6. **Field resolvers enable nesting** - `@ResolveField()` for related data
7. **Guards protect operations** - Same pattern as REST, adapted for GraphQL

### Files to Study

| File | Concepts |
|------|----------|
| `graphql.module.ts` | Apollo configuration |
| `enums.ts` | Enum registration |
| `account.model.ts` | Object types |
| `account.input.ts` | Input types, validation |
| `accounts.resolver.ts` | Queries, mutations |
| `households.resolver.ts` | Field resolvers |
| `gql-auth.guard.ts` | Authentication |
| `current-user.decorator.ts` | Context access |

### Practice Exercises

1. Add a `goal` feature with full CRUD operations
2. Add a field resolver for account's recent transactions
3. Create a mutation for bulk transaction import
4. Add a `statistics` query that aggregates household data

---

**Next Module:** [React Fundamentals](./04-react-fundamentals.md)
