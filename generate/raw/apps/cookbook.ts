import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as cookbook from '../../../src/apps/cookbook';

type ParamsT = Parameters<typeof cookbook['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);