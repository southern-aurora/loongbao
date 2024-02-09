import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as helloWorld$say from '../../../../src/app/get';

export const params = async (params: any) => typia.misc.validatePrune<Parameters<typeof helloWorld$say['api']['action']>[0]>(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof helloWorld$say['api']['action']>>>>;  return typia.json.stringify<T>(results); };