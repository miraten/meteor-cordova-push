Meteor.methods({
  pushSetToken: function(attributes) {
    check(attributes, {
      os: String,
      deviceToken: String
    });

    var os = -1;
    switch (attributes.os) {
      case 'android':
        os = 10;
        break;
      case 'iOS':
        os = 20;
        break;
      default:
        os = -1;
    }
    
    var saved = Meteor.user();
    if (saved) {
      if (saved.profile.mobile.deviceToken !== attributes.deviceToken) {
        Meteor.users.update(saved._id, { 
          $set: { 
            'profile.mobile.os': os,
            'profile.mobile.deviceToken': attributes.deviceToken
          }
        });
        
        Logger.info('Cordova deviceToken updated for userId = ' + this.userId);
      }
    } else {
      Connections.update(this.connection.id, { $set: {
        mobile: {
          os: os,
          deviceToken: attributes.deviceToken
        }
      }});
      
      Logger.info('Cordova deviceToken set for connectionId = ' + this.connection.id);
    }
    
    return true;
  }  
});
