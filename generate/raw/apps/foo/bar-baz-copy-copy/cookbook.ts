import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as foo$barBazCopyCopy$cookbook from '../../../../../src/apps/foo/bar-baz-copy-copy/cookbook';

type ParamsT = Parameters<typeof foo$barBazCopyCopy$cookbook['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);