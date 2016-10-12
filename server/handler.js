'use strict';

// You can add more handlers here, and reference them in serverless.yml

import latest from './functions/metadata/latest';
import enumerator from './functions/metadata/enumerator';
import identifier from './functions/metadata/identifier';
import zone from './functions/metadata/zone';
import hostname from './functions/metadata/hostname';
import credentials from './functions/metadata/credentials';

export { latest, enumerator, identifier, zone, hostname, credentials };
