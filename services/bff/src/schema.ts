import {
  interfaceType,
  objectType,
  makeSchema,
  queryType,
  nonNull,
  idArg,
} from 'nexus'
import { join } from 'path'

interface User {
  id: string
  showPremiumBanner: boolean
}

const data: User[] = [
  {
    id: '1',
    showPremiumBanner: true,
  },
  {
    id: '2',
    showPremiumBanner: false,
  },
  {
    id: '3',
    showPremiumBanner: true,
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
    t.boolean('showPremiumBanner', {
      resolve(o) {
        const match = data.find((u) => u.id === o.id)
        return match!.showPremiumBanner
      },
    })
  },
})

const Query = queryType({
  definition(t) {
    t.list.field('premiumUsers', {
      type: User,
      resolve() {
        return data.filter((u) => u.showPremiumBanner)
      },
    })
    t.field('_premiumBanner', {
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
