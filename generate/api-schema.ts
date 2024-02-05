/**
 * ⚠️This file is generated and modifications will be overwritten
 */
 
// api
import type * as helloWorld$say2 from '../src/app/hello-world/say-2'
import type * as helloWorld$say from '../src/app/hello-world/say'

import _apiParams from './products/api-params'

export default {
  apiParams: _apiParams,
  apiMethodsSchema: {
    'hello-world/say-2': () => ({ module: import('../src/app/hello-world/say-2') }),
    'hello-world/say': () => ({ module: import('../src/app/hello-world/say') }),
    
  },
  apiMethodsTypeSchema: {
    'hello-world/say-2': undefined as unknown as typeof helloWorld$say2,
    'hello-world/say': undefined as unknown as typeof helloWorld$say,
    
  },
  apiTestsSchema: {
    'hello-world/say-2': () => ({ module: import('../src/app/hello-world/say-2') }),
    'hello-world/say': () => ({ module: import('../src/app/hello-world/say') }),
    
  },
}