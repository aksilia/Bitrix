// tslint:disable:object-literal-sort-keys

import { Get } from '../client/methods/get'
import { List } from '../client/methods/list'
import { GetParams, Lead, ListParams, Method } from '../types'

interface Dependencies {
  readonly get: Get
  readonly list: List
}

export default ({ get, list }: Dependencies) => ({
  get: (params?: GetParams) => get<Lead>(Method.GET_LEAD, params),
  list: (params?: ListParams) => list<Lead>(Method.LIST_LEADS, params)
})