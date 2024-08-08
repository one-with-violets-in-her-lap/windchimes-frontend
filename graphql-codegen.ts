import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
    overwrite: true,
    schema: process.env.VITE_GRAPHQL_API_URL,
    documents: 'src/**/*.vue',
    generates: {
        './src/shared/model/graphql-generated-types/': {
            preset: 'client',
            plugins: [],
        },
    },
}

export default config
