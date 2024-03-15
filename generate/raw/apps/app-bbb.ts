import typia from "typia";
import { ExecuteResultSuccess, _validate } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as appBbb from '../../../src/apps/app-bbb';

type ParamsT = Parameters<typeof appBbb['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
type ResultsT = Awaited<ReturnType<typeof appBbb['api']['action']>>;
export const results = async (results: any) => { _validate(typia.validate<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results)); return typia.json.stringify<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results); };