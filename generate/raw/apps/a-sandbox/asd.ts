import typia from "typia";
import { _validate, type ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as aSandbox$asd from '../../../../src/apps/a-sandbox/asd';

type ParamsT = Parameters<typeof aSandbox$asd['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
type ResultsT = Awaited<ReturnType<typeof aSandbox$asd['api']['action']>>;
export const results = async (results: any) => { _validate(typia.validate<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results)); return typia.json.stringify<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results); };