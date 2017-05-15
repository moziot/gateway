/**
 *
 * index.js - Loads the GPIO adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var fs = require('fs');

function maybeLoadGpioAdapter(adapterManager) {
  var gpioConfigFilename = 'config/gpio-config.js';

  // Verify that we have write permissions to /sys/class/gpio/export. Under
  // regular linux, this file is owned by root, so the server would need to
  // run as the root user. On the Raspberry Pi, being a member of the gpio
  // group allows non-root access.
  //
  // This file won't exist on Mac/Windows.
  try {
    fs.accessSync('/sys/class/gpio/export', fs.constants.W_OK);
  } catch (err) {
    console.log('Not starting GPIO adapter - ' +
                'no permissions to /sys/class/gpio/export');
    return;
  }

  if (!fs.existsSync(gpioConfigFilename)) {
    console.log('Not starting GPIO adapter - no config file');
    return;
  }

  var gpioConfigs = require('../../' + gpioConfigFilename);

  var loadGpioAdapter = require('./gpio-adapter.js');
  loadGpioAdapter(adapterManager, gpioConfigs);
}

module.exports = maybeLoadGpioAdapter;
