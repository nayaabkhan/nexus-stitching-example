import { introspectSchema } from '@graphql-tools/wrap'
import { stitchSchemas } from '@graphql-tools/stitch'
import { ApolloServer } from 'apollo-server'
import makeRemoteExecutor from './makeRemoteExecutor'
import waitOn from 'wait-on'

async function makeGatewaySchema() {
  const domainRemoteExecutor = makeRemoteExecutor(
    'http://localhost:4001/graphql'
  )
  const scoreRemoteExecutor = makeRemoteExecutor(
    'http://localhost:4002/graphql'
  )
  const bffRemoteExecutor = makeRemoteExecutor('http://localhost:4003/graphql')

  return stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(domainRemoteExecutor),
        executor: domainRemoteExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: 'userById',
            args: ({ id }) => ({ id }),
          },
        },
      },
      {
        schema: await introspectSchema(scoreRemoteExecutor),
        executor: scoreRemoteExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: '_score',
            args: ({ id }) => ({ id }),
          },
        },
      },
      {
        schema: await introspectSchema(bffRemoteExecutor),
        executor: bffRemoteExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: '_premiumBanner',
            args: ({ id }) => ({ id }),
          },
        },
      },
    ],
  })
}

waitOn({ resources: ['tcp:4001', 'tcp:4002', 'tcp:4003'] }, async () => {
  const server = new ApolloServer({ schema: await makeGatewaySchema() })

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
})
