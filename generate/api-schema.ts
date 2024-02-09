/**
 * ⚠️ This file is generated and modifications will be overwritten
 */

// api
import type * as get from '../src/app/get'
import type * as helloWorld$get from '../src/app/hello-world/get'

import _apiValidator from './products/api-validator'

export default {
  apiValidator: _apiValidator,
  apiMethodsSchema: {
    'get': () => ({ module: import('../src/app/get') }),
    'hello-world/get': () => ({ module: import('../src/app/hello-world/get') }),
    
  },
  apiMethodsTypeSchema: {
    'get': undefined as unknown as typeof get,
    'hello-world/get': undefined as unknown as typeof helloWorld$get,
    
  },
  apiTestsSchema: {
    'get': () => ({ module: import('../src/app/get') }),
    'hello-world/get': () => ({ module: import('../src/app/hello-world/get') }),
    
  },
}