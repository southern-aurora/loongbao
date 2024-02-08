import typia from "typia";
import type * as helloWorld$say2 from '../../../../src/app/hello-world/say-2';

export default async (params: unknown) => typia.misc.validatePrune<Parameters<typeof helloWorld$say2['api']['action']>[0]>(params)