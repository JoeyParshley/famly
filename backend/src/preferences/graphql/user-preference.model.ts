import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Theme } from '../../graphql/enums';

@ObjectType()
export class UserPreferenceModel {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => Theme)
  theme: Theme;

  @Field(() => Float)
  balanceAlertThreshold: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
