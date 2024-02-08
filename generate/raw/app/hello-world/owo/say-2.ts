import typia from "typia";
import type * as helloWorld$owo$say2 from '../../../../../src/app/hello-world/owo/say-2';

export default async (params: unknown) => typia.misc.validatePrune<Parameters<typeof helloWorld$owo$say2['api']['action']>[0]>(params)