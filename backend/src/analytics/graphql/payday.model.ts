import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { PaydayFrequency } from '../../graphql/enums';

@ObjectType()
export class PaydayModel {
  @Field(() => ID)
  id: string;

  @Field()
  householdId: string;

  @Field()
  name: string;

  @Field(() => Float)
  amount: number;

  @Field(() => PaydayFrequency)
  frequency: PaydayFrequency;

  @Field()
  nextDate: Date;

  @Field()
  createdAt: Date;
}
