'use strict';

// You can add more handlers here, and reference them in serverless.yml

import latest from './functions/latest';
import enumerator from './functions/enumerator';
import identifier from './functions/identifier';
import zone from './functions/zone';
import hostname from './functions/hostname';
import credentials from './functions/credentials';

export { latest, enumerator, identifier, zone, hostname, credentials }
