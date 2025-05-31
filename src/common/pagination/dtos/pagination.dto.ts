import { Field, ObjectType, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  perPage?: number = 10;

  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
@ObjectType()
export class PaginationMetadata {
  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int, { nullable: true })
  prevPage: number | null;

  @Field(() => Int, { nullable: true })
  nextPage: number | null;
}
