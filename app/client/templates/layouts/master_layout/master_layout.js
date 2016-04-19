/*****************************************************************************/
/* MasterLayout: Event Handlers */
/*****************************************************************************/
Template.MasterLayout.events({});


/*****************************************************************************/
/* MasterLayout: Helpers */
/*****************************************************************************/
Template.MasterLayout.helpers({
  'isActiveRoute': routeName => Router.current().route.getName() === routeName ? 'active' : ''
  ,
  'email': function () {
    var coded = "kPiNT6Wni.P6DNA6PFtT@WNPnki6q.NA"
    var key = "Y05eKMAaiV6R4J2LkvhfWUZDFsSNxgBH89EToGuPnzO17ylj3wtmbdcXCrpQIq"
    var shift = coded.length
    var link = ""
    for (let i = 0; i < coded.length; i++) {
      if (key.indexOf(coded.charAt(i)) == -1) {
        let ltr = coded.charAt(i)
        link += (ltr)
      }
      else {
        let ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length
        link += (key.charAt(ltr))
      }
    }
    return "<a href='mailto:" + link + "'>Email me.</a>";
  },
  //TODO transition effect jumps from down to up as well; impossible to fix probably: https://github.com/percolatestudio/momentum-iron-router/issues/14
  transition: () => (from, to, element) => to.template === "Bets" ? 'left-to-right' :  'right-to-left'
});


/*****************************************************************************/
/* MasterLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.MasterLayout.onCreated(() => Session.setDefault('currentStep', 1));

Template.MasterLayout.onRendered(function () {
  var instance = this;

  // Beauty and sound for the two buttons of the header menu.
  instance.soundMenu = new Audio('sounds/tranzistor_nav.mp3');
  instance.$('#menuitems li>a').hover(
    function (event) {
      if (!$(this).hasClass('active'))
        instance.soundMenu.play();
      instance.$('#menuitems li.active >a').css('border-color', 'transparent');
      $(this).css('border-color', 'white');
    },
    function (event) {
      var element = document.elementFromPoint(event.pageX, event.pageY);
      if ($(element).is('ul, li, a'))
        instance.soundMenu.cloneNode(true).play();
      $(this).css('border-color', 'transparent');
      instance.$('#menuitems li.active >a').css('border-color', 'white');
    });
});