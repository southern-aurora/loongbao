import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as helloWorld$say from '../../../../src/apps/hello-world/say';

type ParamsT = Parameters<typeof helloWorld$say['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);