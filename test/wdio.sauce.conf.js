const path = require('path');
const { config } = require('./wdio.conf');

const sauceOptions = {
  'sauce:options': {
    build: `focus-visible (${process.env.BUILD_ID ||
      Math.random()
        .toString()
        .slice(2)})`
  }
};

exports.config = {
  ...config,
  user: process.env.SAUCE_USERNAME || 'robdodson_inert',
  key: process.env.SAUCE_ACCESS_KEY || 'a844aee9-d3ec-4566-94e3-dba3d0c30248',

  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    [
      'sauce',
      {
        sauceConnect: true
      }
    ],
    [
      'static-server',
      {
        port: 8080,
        folders: [
          { mount: '/', path: path.join(__dirname, '/fixtures') },
          { mount: '/dist', path: path.join(__dirname, '..', '/src') }
        ]
      }
    ]
  ],
  maxInstances: 200,
  capabilities: [
    {
      browserName: 'chrome',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      ...sauceOptions
    },
    {
      browserName: 'firefox',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      ...sauceOptions
    },
    {
      browserName: 'microsoftedge',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      ...sauceOptions
      // }, {
      //     browserName: 'internet explorer',
      //     platformName: 'Windows 10',
      //     browserVersion: '11.285',
      //     ...sauceOptions
    }
  ]
};
