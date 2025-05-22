import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthEntity } from '../../auth/entities/auth.entity';
import { RoleEntity } from '../../common/entities/role.entity';

@ObjectType()
export class UserEntity implements User {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly address: string;

  @Field()
  readonly phoneNumber: string;

  @Field()
  readonly email: string;

  @HideField()
  readonly password: string;

  @HideField()
  readonly resetPasswordToken: string | null;

  @Field()
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
