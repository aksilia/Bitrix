import { Call } from '../../client/methods/call'
import { Method, MethodParams } from '../../methods'

type Dependencies = {
  readonly call: Call
}

export default ({ call }: Dependencies) => ({
  fields: () => call(Method.USER_FIELDS, {}),

  get: (params: MethodParams<Method.USER_GET> = {}) => call(Method.USER_GET, params)
})
