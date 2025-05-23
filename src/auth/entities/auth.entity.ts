import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Auth } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity'; // Import the UserEntity we created earlier

@ObjectType()
export class AuthEntity implements Auth {
  @Field(() => ID)
  readonly id: number;

  @HideField()
  readonly jti: string;

  @Field()
  readonly userId: number;

  @HideField()
  readonly refreshToken: string;

  @Field(() => Date)
  readonly refreshExpiresAt: Date;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => UserEntity)
  readonly user: UserEntity;
}
