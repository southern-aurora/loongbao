/**
 * ⚠️ This file is generated and modifications will be overwritten
 */

// api
import type * as aSandbox$helloWorld from '../src/apps/a-sandbox/hello-world'
import type * as aSandbox$test from '../src/apps/a-sandbox/test'
import type * as cookbook from '../src/apps/cookbook'
import type * as helloWorld$say from '../src/apps/hello-world/say'

import _apiValidator from './products/api-validator.ts'

export default {
  apiValidator: _apiValidator,
  apiMethodsSchema: {
    'a-sandbox/hello-world': () => ({ module: import('../src/apps/a-sandbox/hello-world') }),
    'a-sandbox/test': () => ({ module: import('../src/apps/a-sandbox/test') }),
    'cookbook': () => ({ module: import('../src/apps/cookbook') }),
    'hello-world/say': () => ({ module: import('../src/apps/hello-world/say') }),
    
  },
  apiMethodsTypeSchema: {
    'a-sandbox/hello-world': undefined as unknown as typeof aSandbox$helloWorld,
    'a-sandbox/test': undefined as unknown as typeof aSandbox$test,
    'cookbook': undefined as unknown as typeof cookbook,
    'hello-world/say': undefined as unknown as typeof helloWorld$say,
    
  },
  apiTestsSchema: {
    'a-sandbox/hello-world': () => ({ module: import('../src/apps/a-sandbox/hello-world') }),
    'a-sandbox/test': () => ({ module: import('../src/apps/a-sandbox/test') }),
    'hello-world/say': () => ({ module: import('../src/apps/hello-world/say') }),
    
  },
}