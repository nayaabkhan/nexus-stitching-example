import { print } from 'graphql'
import { fetch } from 'cross-fetch'
import type { ASTNode } from 'graphql'

export default function makeRemoteExecutor(url: string, options = {}) {
  return async function domainRemoteExecutor({
    document,
    variables,
  }: {
    document: ASTNode
    variables?: Record<string, any>
  }) {
    const query = typeof document === 'string' ? document : print(document)

    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })

    return fetchResult.json()
  }
}
