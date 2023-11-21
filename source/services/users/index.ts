import { Call } from '../../client/methods/call'
import { List } from '../../client/methods/list'
import { Method, MethodParams } from '../../methods'

type Dependencies = {
  readonly call: Call
  readonly list: List
}

export default ({ call, list }: Dependencies) => ({
  fields: () => call(Method.USER_FIELDS, {}),

  get: (params: MethodParams<Method.USER_GET> = {}) =>
    list(Method.USER_GET, params),
})
