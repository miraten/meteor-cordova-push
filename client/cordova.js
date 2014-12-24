
PushManager = {};

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
    
  // set iOS device token
  self.tokenHandler = function(result) {
    var attributes = {
      os: 'iOS',
      deviceToken: result
    };
    
    Meteor.call('pushSetToken', attributes, function(error, result) {
      if (error) {
        console.log('Push init failed: ' + error.message);
      } else {
        console.log('Push init success: ' + result);
      } 
    });
  };

  self.successHandler = function(result) {
    console.log('Push init success: ' + JSON.stringify(result));
  };

  self.errorHandler = function(error) {
    console.log('Push error: ' + error);
  };

  // handle APNS notifications for iOS
  self.onNotificationAPN = function(e) {
    var pushNotification = window.plugins.pushNotification;
    //console.log('onNotificationAPN Called');

    if (e.alert) {
      // navigator.notification.vibrate(500);
      //   navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
      // var snd = new Media(e.sound);
      // snd.play();
    }
    
    if (e.badge) {
      pushNotification.setApplicationIconBadgeNumber(self.successHandler, e.badge);
    }

    /*
    if (self.triggerEvent) {            
      self.triggerEvent('pushLaunch', e);//e.alert });
      eventEmitter.emit('pushLaunch', e);
    }
    */
  };

  // handle GCM notifications for Android
  self.onNotificationGCM = function(e) {

    console.log('onNotificationGCM called: event = ' + JSON.stringify(e));
        
    switch(e.event) {
      case 'registered':
        if (e.regid.length > 0) {
          var attributes = {
            os: device.platform.toLowerCase(),
            deviceToken: e.regid
          };

          Meteor.call('pushSetToken', attributes, function(error, result) {
            if (error) {
              console.log('Push init failed: ' + error.message);
            } else {
              console.log('Push init success: ' + result);
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
        console.log('GCM Notification Error: ' + JSON.stringify(e));
      break;
    }
  };

    // Initialize on ready
  document.addEventListener('deviceready', function() {
    var pushNotification = window.plugins.pushNotification;
      // console.log('Push Registration');
      // onNotificationAPN = self.onNotificationAPN;
      // onNotificationGCM = self.onNotificationGCM;

      try {
        if (device.platform.toLowerCase() === 'android') {         
          if (self._options.senderId) {
            pushNotification.register(self.successHandler, self.errorHandler, {
              'senderID': self._options.senderId,
              'ecb': 'PushManager.onNotificationGCM'
            });
          } else {
            throw new Error('senderId not set in options, required on android');
          }

        } else {
          pushNotification.register(self.tokenHandler, self.errorHandler, {
            'badge': self._options.badge,
            'sound': self._options.sound,
            'alert': self._options.alert,
            'ecb': 'PushManager.onNotificationAPN'
          }); // required!
        }
      } catch(ex) {
        console.log('Push init fail: ' + ex.message);
      }

  }, true);

};
