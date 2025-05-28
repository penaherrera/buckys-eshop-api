import {
  Field,
  GraphQLISODateTime,
  HideField,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { Auth } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

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

  @Field(() => GraphQLISODateTime)
  readonly refreshExpiresAt: Date;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: Date;

  @Field(() => UserEntity)
  readonly user: UserEntity;
}
