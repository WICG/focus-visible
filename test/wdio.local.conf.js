const path = require('path');
const { config } = require('./wdio.conf');

exports.config = {
  ...config,
  maxInstances: 1,
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    // 'chromedriver',
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
  capabilities: [
    {
      browserName: 'firefox'
    }
  ]
};
