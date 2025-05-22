import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

@InputType({ description: 'Input type to update an user info' })
export class UpdateUserInput {
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'First name of the user',
  })
  firstName?: string;

  @IsString()
  @Field(() => String, { nullable: true, description: 'Last name of the user' })
  lastName?: string;

  @IsString()
  @Field(() => String, { nullable: true, description: 'Address of the user' })
  address?: string;

  @IsString()
  @IsPhoneNumber()
  @Field(() => String, {
    nullable: true,
    description: 'Phone number of the user',
  })
  phoneNumber?: string;

  @IsEmail()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Email number of the user',
  })
  email?: string;
}
