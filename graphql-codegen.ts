import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
    overwrite: true,
    schema: process.env.VITE_GRAPHQL_API_URL,
    documents: ['src/**/*.vue', 'src/**/*.ts'],
    generates: {
        './src/shared/model/graphql-generated-types/': {
            preset: 'client',
            plugins: [],
            config: {
                useTypeImports: true,
            },
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
}

export default config
