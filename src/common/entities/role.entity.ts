import { Field, ID, ObjectType } from '@nestjs/graphql';
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

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  @Field(() => [UserEntity], { nullable: true })
  readonly user?: UserEntity[];
}
