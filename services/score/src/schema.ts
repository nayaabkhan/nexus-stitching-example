import {
  interfaceType,
  objectType,
  makeSchema,
  queryType,
  nonNull,
  idArg,
} from 'nexus'
import { join } from 'path'

interface Score {
  id: string
  score: number
}

const data: Score[] = [
  {
    id: '1',
    score: 30,
  },
  {
    id: '2',
    score: 10,
  },
  {
    id: '3',
    score: 20,
  },
]

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id')
  },
  resolveType() {
    return null
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(Node)
    t.int('score', {
      resolve(o) {
        const match = data.find((u) => u.id === o.id)
        return match!.score
      },
    })
  },
})

const Query = queryType({
  definition(t) {
    t.int('highest', {
      resolve() {
        const highSeen = 0
        const userWithHighest = data.find((u) => u.score > highSeen)
        return userWithHighest!.score
      },
    })
    t.field('_score', {
      type: User,
      args: {
        id: nonNull(idArg()),
      },
      resolve(_, args) {
        return data.find((rec) => rec.id === args.id)
      },
    })
  },
})

export const schema = makeSchema({
  types: [Node, User, Query],
  outputs: {
    schema: join(__dirname, '..', 'schema.graphql'),
  },
})
