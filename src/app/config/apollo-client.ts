import {
    ApolloClient,
    ApolloLink,
    concat,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client/core'

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
})

const authLink = new ApolloLink((operation, forward) => {
    const idTokenData = JSON.parse(
        localStorage.getItem(
            `@@auth0spajs@@::${import.meta.env.VITE_AUTH0_CLIENT_ID}::@@user@@`,
        ) || 'null',
    )

    console.log(idTokenData)

    if (idTokenData?.id_token) {
        operation.setContext({
            headers: {
                Authorization: `Bearer ${idTokenData.id_token}`,
            },
        })
    }

    return forward(operation)
})

const cache = new InMemoryCache()

export default new ApolloClient({
    link: concat(authLink, httpLink),
    cache,
})
