import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as foo$barBaz$cookbookCopyCopy from '../../../../../src/apps/foo/bar-baz/cookbook-copy-copy';

type ParamsT = Parameters<typeof foo$barBaz$cookbookCopyCopy['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);