Meteor.startup(function () {
});

global.shownNotifications = [];

var notificationUK = ()=> shownNotifications.push(Notifications.warn('UK style?', "If you want to use fractional style, then instead of 'x' write 'x/1' in order to differentiate of decimal odds."));
global.notificationUKonce = _.once(notificationUK);

var notificationUS = () => shownNotifications.push(Notifications.warn('US style?', "If you want to use moneylines, prefix them with '+' or '-'. Otherwise they are considered decimal odds."));
global.notificationUSonce = _.once(notificationUS);

var notificationError = () => shownNotifications.push(Notifications.error(notification_title, notification_body, {timeout: 13000}));
var throttledFunction = _.throttle(notificationError, 13000, {trailing: false});
global.notificationErrorThrottled = function (title, body) {
  global.notification_title = title;
  global.notification_body = body;
  throttledFunction();
}
