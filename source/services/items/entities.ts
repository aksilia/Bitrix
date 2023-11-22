import { NumberString } from '../common'

export type Item = {
  // Deal can have user fields
  readonly [key: string]: string | null

  readonly ID: NumberString
  readonly TITLE: string
}
