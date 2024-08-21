import { ErrorGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export type ExcludeGraphQLError<TResult> = Exclude<
    NonNullable<TResult>,
    ErrorGraphQl
>
