global.setSelectionRange = function(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

global.setCaretToPos = function(input, pos) {
  setSelectionRange(input, pos, pos);
}

global.showAsPercentage = (float_input) => (float_input * 100).toFixed(2) + '%';

global.reset = function() {
  let nextId = startNewCheck();
  Session.set('activeCheck', nextId);
  shownNotifications.map((notificationId) => Notifications.remove({_id: notificationId}));
  Session.set('showReactiveTable', false);
}