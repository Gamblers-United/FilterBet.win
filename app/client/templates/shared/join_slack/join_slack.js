/*****************************************************************************/
/* JoinSlack: Event Handlers */
/*****************************************************************************/
Template.JoinSlack.events({
  'click #sendInvite': function (event, template) {
    let email = template.$('#recipient').val();
    console.log(email);
    if (isEmailValid(email)) {
      Meteor.call('server\joinSlack', email);
      Modal.hide('JoinSlack');
      shownNotifications.push(Notifications.success('Thanks!', "You'll receive an invite in less than 48 hours.", {timeout: 4000}));
    }
  }
});

/*****************************************************************************/
/* JoinSlack: Helpers */
/*****************************************************************************/
Template.JoinSlack.helpers({
});

/*****************************************************************************/
/* JoinSlack: Lifecycle Hooks */
/*****************************************************************************/
Template.JoinSlack.onCreated(function () {
});

Template.JoinSlack.onRendered(function () {
});

Template.JoinSlack.onDestroyed(function () {
});
