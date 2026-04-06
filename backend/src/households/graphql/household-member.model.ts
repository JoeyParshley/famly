import { ObjectType, Field, ID } from '@nestjs/graphql';
import { HouseholdRole } from '../../graphql/enums';
import { UserModel } from '../../auth/graphql/user.model';

@ObjectType()
export class HouseholdMemberModel {
  @Field(() => ID)
  id: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => HouseholdRole)
  role: HouseholdRole;

  @Field()
  createdAt: Date;
}
