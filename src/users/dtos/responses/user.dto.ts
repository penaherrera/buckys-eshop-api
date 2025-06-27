import { Exclude, Expose } from 'class-transformer';
import {
  Field,
  GraphQLISODateTime,
  HideField,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
@Exclude()
export class UserDto {
  @Field(() => ID)
  @Expose()
  id: number;

  @Field(() => String)
  @Expose()
  firstName: string;

  @Field(() => String)
  @Expose()
  lastName: string;

  @Field(() => String)
  @Expose()
  address: string;

  @Field(() => String)
  @Expose()
  phoneNumber: string;

  @Field(() => String)
  @Expose()
  email: string;

  @Field(() => GraphQLISODateTime)
  @Expose()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Expose()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose()
  deletedAt: Date | null;
}
