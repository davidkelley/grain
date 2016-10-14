'use strict';

// You can add more handlers here, and reference them in serverless.yml

import enumerator from './functions/metadata/enumerator';
import credentials from './functions/metadata/credentials';

export { enumerator, credentials };
