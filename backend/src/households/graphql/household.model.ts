import { ObjectType, Field, ID } from '@nestjs/graphql';
import { HouseholdMemberModel } from './household-member.model';

@ObjectType()
export class HouseholdModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field(() => [HouseholdMemberModel], { nullable: true })
  members?: HouseholdMemberModel[];
}
