import {
  interfaceType,
  objectType,
  makeSchema,
  queryType,
  idArg,
  nonNull,
} from 'nexus'
import { join } from 'path'

const data = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Elya',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Eyre',
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Frost',
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
    t.string('firstName')
    t.string('lastName')
    t.string('fullName', {
      resolve(o) {
        return `${o.firstName} ${o.lastName}`
      },
    })
  },
})

const Query = queryType({
  definition(t) {
    t.field('me', {
      type: User,
      resolve() {
        return data[0]
      },
    })

    t.field('userById', {
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
