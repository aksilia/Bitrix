import { ListParams, Method } from '../../methods'
import { GetPayload, ListPayload } from '../../payloads'
import { User } from './entities'

export type UsersMethods = {
  readonly [Method.USER_FIELDS]: {
    readonly type: User
    readonly payload: GetPayload<User>
    readonly params?: Record<string, unknown>
  }

  readonly [Method.USER_GET]: {
    readonly type: User
    readonly payload: ListPayload<User>
    readonly params: ListParams
  }
}
