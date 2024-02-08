import typia from "typia";
import type * as helloWorld$say from '../../../../src/app/hello-world/say';

export default async (params: unknown) => typia.misc.validatePrune<Parameters<typeof helloWorld$say['api']['action']>[0]>(params)