/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'server\joinSlack': function (email) {
    if (isEmailValid(email))
    {
      Email.send({
        to: 'laurentiu.andronache@trailung.ro',
        from: 'JoinSlack@filterbet.win',
        subject: 'I would like to join the Gamblers United slack group!',
        text: email
      });
    }
  }
});
