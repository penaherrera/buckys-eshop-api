import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Auth } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity'; // Import the UserEntity we created earlier

@ObjectType()
export class AuthEntity implements Auth {
  @Field(() => ID)
  id: number;

  @HideField()
  jti: string;

  @Field()
  userId: number;

  @HideField()
  refreshToken: string;

  @Field(() => Date)
  refreshExpiresAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => UserEntity)
  user: UserEntity;
}
