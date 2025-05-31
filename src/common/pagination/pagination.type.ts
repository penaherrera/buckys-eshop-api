import { Field, Int, ObjectType } from '@nestjs/graphql';

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
