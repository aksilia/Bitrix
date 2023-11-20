import { Call } from '../../client/methods/call'
import { List } from '../../client/methods/list'
import { Method, MethodParams } from '../../methods'

type Dependencies = {
  readonly call: Call
  readonly list: List
}

export default ({ call, list }: Dependencies) => ({
  fields: () =>
    call(Method.CRM_ITEM_FIELDS, {}),

  create: <D extends MethodParams<Method.CRM_ITEM_ADD>>(fields: D['fields'], params?: D['params']) =>
    call(Method.CRM_ITEM_ADD, { fields, params }),

  get: (id: string) =>
    call(Method.CRM_ITEM_GET, { id }),

  list: (params: MethodParams<Method.CRM_ITEM_LIST> = {}) =>
    list(Method.CRM_ITEM_LIST, params),

  update: <D extends MethodParams<Method.CRM_ITEM_UPDATE>>(id: string, fields: D['fields'], params?: D['params']) =>
    call(Method.CRM_ITEM_UPDATE, { id, fields, params })
})
