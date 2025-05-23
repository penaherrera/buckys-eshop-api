import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthEntity } from '../../auth/entities/auth.entity';
import { RoleEntity } from '../../common/entities/role.entity';

@ObjectType()
export class UserEntity implements User {
  @Field(() => ID)
  readonly id: number;

  @Field(() => String)
  readonly firstName: string;

  @Field(() => String)
  readonly lastName: string;

  @Field(() => String)
  readonly address: string;

  @Field(() => String)
  readonly phoneNumber: string;

  @Field(() => String)
  readonly email: string;

  @HideField()
  readonly password: string;

  @HideField()
  readonly resetPasswordToken: string | null;

  @Field(() => Int)
  readonly roleId: number;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  @Field(() => Date, { nullable: true })
  readonly deletedAt: Date | null;

  @Field(() => [AuthEntity], { nullable: true })
  readonly auth?: AuthEntity[];

  @Field(() => RoleEntity)
  readonly role: RoleEntity;
}
