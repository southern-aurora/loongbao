import typia from "typia";
import { _validate, type ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as aSandbox$helloWorld from '../../../../src/apps/a-sandbox/hello-world';

type ParamsT = Parameters<typeof aSandbox$helloWorld['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
type ResultsT = Awaited<ReturnType<typeof aSandbox$helloWorld['api']['action']>>;
export const results = async (results: any) => { _validate(typia.validate<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results)); return typia.json.stringify<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results); };