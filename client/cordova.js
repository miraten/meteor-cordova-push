/**
 * Detect the device token of iOS, Android
 */
PushManager = {

  // handle APNS notifications for iOS
  onNotificationAPN: function(e) {
    var pushNotification = window.plugins.pushNotification;
    alert('onNotificationAPN Called');

    if (e.alert) {
      navigator.notification.vibrate(500);
      navigator.notification.alert(e.alert);
    }

    if (e.sound) {
      var snd = new Media(e.sound);
      snd.play();
    }

    if (e.badge) {
      pushNotification.setApplicationIconBadgeNumber(function(result) {
        alert('Push init success: ' + JSON.stringify(result));
      }, e.badge);
    }

    /*
     if (self.triggerEvent) {
     self.triggerEvent('pushLaunch', e);//e.alert });
     eventEmitter.emit('pushLaunch', e);
     }
     */

  },

  // handle GCM notifications for Android
  onNotificationGCM: function() {
    console.log('onNotificationGCM called: event = ' + JSON.stringify(e));

    switch(e.event) {
      case 'registered':
        if (e.regid.length > 0) {
          var attributes = {
            os: device.platform.toLowerCase(),
            deviceToken: e.regid
          };

          Meteor.call('pushSetToken', attributes, function(error) {
            if (error) {
              alert('Push token set failed: ' + error.message);
            }
          });
        }
        break;

      case 'message':
        alert('onNotificationGCM message event: ' + e.regid);

        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (e.foreground)
        {
          // if the notification contains a soundname, play it.
          // var my_media = new Media("/android_asset/www/"+e.soundname);
          // my_media.play();
        } else {
          //    navigator.notification.vibrate(500);
          // navigator.notification.alert(e.payload.message);
        }

        /*
         if (self.triggerEvent) {
         self.triggerEvent('pushLaunch', e ); // e.foreground, e.foreground, Coldstart or background
         eventEmitter.emit('pushLaunch', e);
         }
         // e.payload.message, e.payload.msgcnt, e.msg, e.soundname
         */
        break;

      case 'error':
        alert('GCM Notification Error: ' + JSON.stringify(e));
        break;
    }

  },

  // register or update the device token of iOS
  apnRegisterSuccessHandler: function(token) {
    console.log('ios device token = ' + token);

    var attributes = { os: 'iOS', deviceToken: token };

    Meteor.call('pushSetToken', attributes, function(error) {
      if (error) {
        alert('Push error: device token update failed: ' + error.message);
      }
    });
  },

  // register or update the device token of Android
  gcmRegisterSuccessHandler: function(result) {
    console.log('GCM register success', result);
  },

  // common error handler
  errorHandler: function(error) {
    alert('Push error: ' + error);
  }
};

/**
 * options: 
 *  senderId: GCM senderId
 *  badge: 'true' or 'false'
 *  sound: 'true' or 'false'
 *  alert: 'true' or 'false'
 */ 
PushManager.init = function(options) {
  var self = this;

  self._options = _.defaults(options, {
    senderId: '',
    badge: 'true',
    sound: 'false',
    alert: 'false'
  });

  // Initialize on ready
  document.addEventListener('deviceready', function() {

    var pushNotification = window.plugins.pushNotification;
    if (device.platform.toLowerCase() === 'android') {
      if (self._options.senderId) {
        try {
          pushNotification.register(self.gcmRegisterSuccessHandler, self.errorHandler, {
            'senderID': self._options.senderId,
            'ecb': 'PushManager.onNotificationGCM'
          });
        } catch (ex) {
          alert('Push register failed:' + ex.message);
        }
      } else {
        alert('Push register failed: missing Android senderId');
      }
    } else if (device.platform.toLowerCase() === 'ios') {
      try {
        pushNotification.register(self.apnRegisterSuccessHandler, self.errorHandler, {
          'badge': self._options.badge,
          'sound': self._options.sound,
          'alert': self._options.alert,
          'ecb': 'PushManager.onNotificationAPN'
        }); // required!
      } catch (ex) {
        alert('Push register failed:' + ex.message);
      }

    } else {
      alert('Error unsupported platform : ' + device.platform);
    }
  });

};
