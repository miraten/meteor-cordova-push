Package.describe({
  name: 'leesangwon:cordova-push',
  summary: 'Cordova Push Notification package',
  version: '0.8.2',
  git: 'https://github.com/miraten/meteor-cordova-push'
});

Cordova.depends({
  // Fix ios 7 and ios in general
  'com.phonegap.plugins.PushPlugin': 'https://github.com/raix/PushPlugin/tarball/c4e3aa69c66bde45472e81ac303a9e39020c9cc7'
  // Fix issue 365 ios 7 missing badge updates
  // 'com.phonegap.plugins.PushPlugin': 'https://github.com/raix/PushPlugin/tarball/ff4ade868488ef0fcb014da652681011cd95d8ea'
  // 'com.clone.phonegap.plugins.pushplugin': '2.4.1' //with #354 fixed OK
  //'com.phonegap.plugins.PushPlugin': 'http://github.com/rossmartin/PushPlugin/tarball/6cf2e1a107310e859839fb7a0dc2618a7a199430'

  //"com.phonegap.plugins.pushplugin": "2.2.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('tracker@1.0.3', 'web.cordova');

  api.addFiles('client/cordova.js', 'web.cordova');
  api.addFiles('server/server.js', 'server');
  
  api.export('PushManager');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:cordova-push');
  api.addFiles('cordova-push-tests.js');
});
