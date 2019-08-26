import range from 'lodash.range'
import {
  BitrixBatchPayload,
  BitrixCommand,
  BitrixCommands,
  BitrixListOptions,
  BitrixListPayload,
  BitrixMethod
} from '../types'
import isArray from '../utils/isArray'
import { MAX_COMMANDS_PER_BATCH } from './batch'

const MAX_ENTRIES_PER_COMMAND = 50
const MAX_ENTRIES_PER_BATCH = MAX_ENTRIES_PER_COMMAND * MAX_COMMANDS_PER_BATCH

const fillBatchCommands = (method: BitrixMethod, start: number, toProcess: number): BitrixCommands => {
  const requiresCommands = Math.ceil(toProcess / MAX_ENTRIES_PER_COMMAND)
  const commandsToDo = requiresCommands > MAX_COMMANDS_PER_BATCH
    ? MAX_COMMANDS_PER_BATCH
    : requiresCommands

  return range(0, commandsToDo).reduce((commands, i) => ({
    ...commands,
    [i]: { method, params: { start: start + (MAX_ENTRIES_PER_COMMAND * i) } }
  }), {})
}

const fillBatchesCommands = (method: BitrixMethod, start: number, toProcess: number): readonly BitrixCommands[] => {
  const requiresBatches = Math.ceil(toProcess / MAX_ENTRIES_PER_BATCH)

  return range(0, requiresBatches).reduce((batchesCommands, i) => {
    const processed = start + (MAX_ENTRIES_PER_BATCH * i)
    const remained = toProcess - processed

    return [ ...batchesCommands, fillBatchCommands(method, processed, remained)]
  }, [] as readonly BitrixCommands[])
}

interface Dependencies {
  readonly getList: <P>(method: BitrixMethod, options: object) => Promise<BitrixListPayload<P>>
  // tslint:disable-next-line no-mixed-interface
  readonly batch: <C extends Record<string, any>>(commands: Record<keyof C, BitrixCommand>) =>
    Promise<BitrixBatchPayload<C>>
}

export default ({ getList, batch }: Dependencies) =>
  async <P>(method: BitrixMethod, options: BitrixListOptions = {}): Promise<BitrixListPayload<P>> => {
    const start = options.start || 0
    const firstCall = await getList<P>(method, { query: { start } })

    // tslint:disable-next-line no-if-statement
    if (!firstCall.next) return firstCall

    const toProcess = firstCall.total - start
    const batches = fillBatchesCommands(method, start, toProcess)
      .map((commands) => batch<Record<keyof typeof commands, readonly P[]>>(commands))

    return Promise.all(batches)
      // @todo Messy, made in hurry. Refactor this. Had some issues with types
      .then((batchesResults) => {
        const flattenBatches = batchesResults.reduce((collectedFlattenBatches, batchesResult) => {
          const { result, result_error } = batchesResult.result
          const flattenCommands = isArray(result)
            ? result.reduce((res, r) => [...res, ...r], [] as readonly P[])
            : Object.values(result)
                .reduce((res, r) => {
                  // tslint:disable-next-line no-if-statement
                  if (!res || !r) return []
                  return [...res, ...r]
                }, [] as readonly P[])

          const flattenErrors = isArray(result_error) ? result_error : Object.keys(result_error)
            // @todo Object.values doesn't work here as it produces strange type
            .reduce((res, errorName) => {
              const error = result_error[errorName]
              return error ? [...res, error] : res
            }, [] as readonly string[])

          return {
            ...collectedFlattenBatches,
            result: [...collectedFlattenBatches.result, ...(flattenCommands ? flattenCommands : [])],
            result_error: [...(collectedFlattenBatches.result_error || []), ...flattenErrors]
          }
        // @todo This is to make it work quick, should be fixed
        // tslint:disable-next-line: no-object-literal-type-assertion
        }, { result: [], result_error: [] } as {
          readonly result: readonly P[], readonly result_error: readonly string[]
        })

        // tslint:disable-next-line no-if-statement
        if (flattenBatches.result_error.length > 0) {
          // tslint:disable-next-line no-throw
          throw new Error(
            `[batch] failed to process the batch. Received ${flattenBatches.result_error.length} errors.`
          )
        }

        return {
          error: undefined,
          // @todo
          next: undefined,
          result: flattenBatches.result,
          // @todo Not accurate, we do not care
          time: firstCall.time,
          total: firstCall.total
        }
      })
  }