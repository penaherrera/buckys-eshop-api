import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class RoleEntity implements Role {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: Date;

  @Field(() => [UserEntity], { nullable: true })
  readonly user?: UserEntity[];
}
