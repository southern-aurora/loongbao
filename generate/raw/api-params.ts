/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
import type * as helloWorld$say2 from '../../src/app/hello-world/say-2'
import type * as helloWorld$say from '../../src/app/hello-world/say'

export default {
  validate: {
    'hello-world/say-2': async (params: unknown) => typia.validateEquals<Parameters<typeof helloWorld$say2['api']['action']>[0]>(params),
    'hello-world/say': async (params: unknown) => typia.validateEquals<Parameters<typeof helloWorld$say['api']['action']>[0]>(params),
    
  },
}