import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as helloWorld$foo from '../../../../src/app/hello-world/foo';

export const params = async (params: any) => typia.misc.validatePrune<Parameters<typeof helloWorld$foo['api']['action']>[0]>(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof helloWorld$foo['api']['action']>>>>;  return typia.json.stringify<T>(results); };