import gql from 'graphql-tag'

export const ERROR_FRAGMENT = gql`
    fragment Error on GraphQLApiError {
        name
        explanation
        technicalExplanation
    }
`
