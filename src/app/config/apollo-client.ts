import { ApolloClient, ApolloLink, InMemoryCache, concat } from '@apollo/client/core'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

const httpLink = createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
})

const authLink = new ApolloLink((operation, forward) => {
    const idTokenData = JSON.parse(
        localStorage.getItem(
            `@@auth0spajs@@::${import.meta.env.VITE_AUTH0_CLIENT_ID}::@@user@@`,
        ) || 'null',
    )

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
