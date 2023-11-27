import got from 'got'
import { stringify as toQuery } from 'qs'
import { Method, MethodParams, MethodPayload } from '../../methods'
import { BatchPayload, ListPayload, Payload, ItemsPayload, GetPayload } from '../../payloads'
import isArray from '../../utils/isArray'

/**
 * Checks wether payload have any errors and if it does — throws them
 * Bitrix payload types do not provide discriminators, so we're forced to type cast them
 */
export const handlePayload = <P extends Payload<unknown>>(payload: P): P => {
  if ((payload as ListPayload<unknown>).error) {
    throw new Error(
    `[call] failed to get the resource: ${(payload as ListPayload<unknown>).error ?? ''}.`
    );
  }

  if ((payload as BatchPayload<unknown>).result && (payload as BatchPayload<unknown>).result.result_error) {
    const resultErrors = (payload as BatchPayload<unknown>).result.result_error;
    const errors = isArray(resultErrors) ? resultErrors : Object.values(resultErrors);

    if (errors.length > 0) {
      // @todo We can give better formatting to display errored commands. But it's not important for now
      throw new Error(`[batch] failed to process. Received errors in ${errors.length} commands:\n${errors.join('\n')}`);
    }
  }

  // Check if it's a ListPayload and result is an object with "items"
  if (
    (payload as ItemsPayload<unknown>).result && 
    typeof (payload as ItemsPayload<unknown>).result === 'object' && 
    'items' in (payload as ItemsPayload<unknown>).result
  ) {
    // Extract the array from "items" and update the result property
    const itemsArray = (payload as ItemsPayload<unknown>).result['items'] || [];
    return { ...payload, result: itemsArray };
  }

  // Check if it's a GetPayload and result is an object with "items"
  if (
    (payload as GetPayload<{ items?: unknown[] }>).
    result && 
    typeof (payload as GetPayload<{ items?: unknown[] }>).
    result === 'object' && 
    'item' in (payload as GetPayload<{ items?: unknown[] }>).
    result
  ) {
    // Extract the array from "items" and update the result property
    const itemsArray = (payload as GetPayload<{ item?: unknown[] }>).
    result['item'] || [];
    return { ...payload, result: itemsArray };
  }

  return payload;
};

export type Call = <M extends Method>(method: M, params: MethodParams<M>) => Promise<MethodPayload<M>>

type Dependencies = {
  readonly get: typeof got.get
}

/**
 * Dispatches a request with specified method and params. Will fill figure out payload type based on the Method
 */
export default ({ get }: Dependencies): Call => {
  const call: Call = <M extends Method>(method: M, params: MethodParams<M>): Promise<MethodPayload<M>> =>
    get<MethodPayload<M>>(method, { searchParams: toQuery(params) })
      .then(({ body }) => handlePayload(body))

  return call
}
