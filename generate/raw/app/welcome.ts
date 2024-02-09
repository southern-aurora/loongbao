import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as welcome from '../../../src/app/get';

export const params = async (params: any) => typia.misc.validatePrune<Parameters<typeof welcome['api']['action']>[0]>(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof welcome['api']['action']>>>>;  return typia.json.stringify<T>(results); };