import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
})

const cache = new InMemoryCache()

export default new ApolloClient({
    link: httpLink,
    cache,
})
