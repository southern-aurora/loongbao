/**
 * ⚠️ This file is generated and modifications will be overwritten
 */

// api
import type * as get from '../src/apps/get'

import _apiValidator from './products/api-validator.ts'

export default {
  apiValidator: _apiValidator,
  apiMethodsSchema: {
    'get': () => ({ module: import('../src/apps/get') }),
    
  },
  apiMethodsTypeSchema: {
    'get': undefined as unknown as typeof get,
    
  },
  apiTestsSchema: {
    'get': () => ({ module: import('../src/apps/get') }),
    
  },
}