import { ObjectType, Field } from '@nestjs/graphql';
import { HouseholdRole } from '../../graphql/enums';

@ObjectType()
export class DemoUserModel {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => HouseholdRole)
  role: HouseholdRole;

  @Field({ nullable: true })
  description?: string;
}
