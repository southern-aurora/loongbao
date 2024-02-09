/**
 * ⚠️ This file is generated and modifications will be overwritten
 */

// api
import type * as get from '../src/app/get'

import _apiValidator from './products/api-validator'

export default {
  apiValidator: _apiValidator,
  apiMethodsSchema: {
    'get': () => ({ module: import('../src/app/get') }),
    
  },
  apiMethodsTypeSchema: {
    'get': undefined as unknown as typeof get,
    
  },
  apiTestsSchema: {
    
  },
}