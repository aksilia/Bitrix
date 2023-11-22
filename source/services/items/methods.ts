import { ListParams, Method } from '../../methods'
import { GetPayload, ListPayload } from '../../payloads'
import { Fields } from '../common'
import { Item } from './entities'

export type ItemsMethods = {
  readonly [Method.CRM_ITEM_FIELDS]: {
    readonly type: Item
    readonly payload: GetPayload<Fields>
    readonly params: Record<string, unknown>
  }

  readonly [Method.CRM_ITEM_ADD]: {
    readonly type: Item
    readonly payload: GetPayload<number>
    readonly params: {
      readonly fields: Partial<Item>
      readonly entityTypeId: string
    }
  }
  readonly [Method.CRM_ITEM_GET]: {
    readonly type: Item
    readonly payload: GetPayload<Item>
    readonly params: {
      readonly id: string
      readonly entityTypeId: string
    }
  }
  readonly [Method.CRM_ITEM_LIST]: {
    readonly type: Item
    readonly payload: ListPayload<Item>
    readonly params: ListParams
  }
  readonly [Method.CRM_ITEM_UPDATE]: {
    readonly type: Item
    readonly payload: GetPayload<boolean>
    readonly params: {
      readonly id: string
      readonly fields: Record<string, unknown>
      readonly entityTypeId: string
    }
  }
}
