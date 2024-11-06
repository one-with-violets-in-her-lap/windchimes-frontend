import gql from 'graphql-tag'

export const ERROR_FRAGMENT = gql`
    fragment Error on ErrorGraphQL {
        name
        explanation
        technicalExplanation
    }
`
