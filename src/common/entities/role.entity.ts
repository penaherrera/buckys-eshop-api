import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class RoleEntity implements Role {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [UserEntity], { nullable: true })
  user?: UserEntity[];
}
