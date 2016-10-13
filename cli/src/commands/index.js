'use strict';

import {
  GRAIN_STATE_PATH,
  GRAIN_PROFILES_PATH,
  GRAIN_CONFIG_PATH,
  DEFAULT_LEVEL,
  DEFAULT_REGION,
  DEFAULT_DOCKER_IMAGE } from '../constants';

import Use from './use';
import Resume from './resume';
import Stop from './stop';

export default [
  {
    command: 'stop',
    options: [
      ["-s, --state-path [path]", `Path to state file. Defaults to ${GRAIN_STATE_PATH}`, GRAIN_STATE_PATH]
    ],
    description: 'stops grain and tidies up profile resources',
    action: Stop
  },
  {
    command: 'resume',
    options: [
      ["-s, --state-path [path]", `Path to state file. Defaults to ${GRAIN_STATE_PATH}`, GRAIN_STATE_PATH]
    ],
    description: 'resumes a previously configured profile',
    action: Resume
  },
  {
    command: 'use <cmd>',
    options: [
      ["-i --image [image]", `Docker proxy image to use. Defaults to "${DEFAULT_DOCKER_IMAGE}"`, DEFAULT_DOCKER_IMAGE],
      ["-p, --profiles-path [path]", `Path to profiles file. Defaults to "${GRAIN_PROFILES_PATH}"`, GRAIN_PROFILES_PATH],
      ["-s, --state-path [path]", `Path to state file. Defaults to ${GRAIN_STATE_PATH}`, GRAIN_STATE_PATH]
    ],
    description: 'Switch EC2 Metadata Profile',
    action: Use
  }
];
