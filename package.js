Package.describe({
  name: 'leesangwon:cordova-push',
  summary: 'Cordova Push Notification package',
  version: '0.7.0',
  git: ' /* Fill me in! */ '
});

Cordova.depends({
  "com.phonegap.plugins.pushplugin": "2.2.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('tracker@1.0.3', 'web.cordova');

  api.addFiles('client/cordova.js', 'client');
  api.addFiles('server/server.js', 'server');
  
  api.export('PushManager');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:cordova-push');
  api.addFiles('cordova-push-tests.js');
});
