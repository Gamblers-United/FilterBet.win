global.ChecksCollection = new Mongo.Collection(null);
//TODO attach schema!
//TODO add enforced check through Collection2, no less than two outcomes
// ChecksCollection.attachSchema(BetSchema);

global.emptyOdds = {
  asOriginalInput: '',
  originalInputFormat: '',
  asPercentage: '',
  asDecimal: '',
  asFractional: '',
  asMoneyline: '',
  asHongKong: '',
  asIndonesian: '',
  asMalay: '',
  asExact: null,
  asTruthier: null,
  asFlbAdjusted: null,
  asTrue: null,
  isValidFormat: ''
};

global.startNewCheck = () => ChecksCollection.insert({
  localInsertDate: new Date(),
  oddsChecked: [emptyOdds, emptyOdds],
  oddsAverages: [emptyOdds, emptyOdds],
  // oddsCompeting: [emptyOdds, emptyOdds],
  commissionOddsChecked: 0,
  commissionOddsCompeting: 0,
  // pick: null,
  // bookmaker: null,
  // tipster: 'Anonymous'
});

let firstId = startNewCheck();
Session.set('activeCheck', firstId);