import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as foo$barBazCopy$cookbook from '../../../../../src/apps/foo/bar-baz-copy/cookbook';

type ParamsT = Parameters<typeof foo$barBazCopy$cookbook['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);