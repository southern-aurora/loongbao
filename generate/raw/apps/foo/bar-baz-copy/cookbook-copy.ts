import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as foo$barBazCopy$cookbookCopy from '../../../../../src/apps/foo/bar-baz-copy/cookbook-copy';

type ParamsT = Parameters<typeof foo$barBazCopy$cookbookCopy['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);