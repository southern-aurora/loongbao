import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as get from '../../../src/app/get';

type ParamsT = Parameters<typeof get['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
export const paramsSchema = typia.json.application<[{ data: ParamsT }], "swagger">();
type HTTPResultsT = Awaited<ReturnType<typeof get['api']['action']>>;
export const HTTPResults = async (results: any) => {  return typia.json.stringify<TSONEncode<ExecuteResultSuccess<HTTPResultsT>>>(results); };