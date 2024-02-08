/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
import type * as helloWorld$say2 from '../../src/app/hello-world/say-2'
import type * as helloWorld$say from '../../src/app/hello-world/say'

export default {
  validate: {
    'hello-world/say-2': () => import('./app/hello-world/say-2.ts'),
    'hello-world/say': () => import('./app/hello-world/say.ts'),
    
  },
}