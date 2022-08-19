const { convertFormStateToCleanedAnswer } = require("./src/giveCleanedAnswer");
const { giveLocationAddresses } = require("./src/locationAddress");

module.exports.convertFormStateToCleanedAnswer =
  convertFormStateToCleanedAnswer;
module.exports.giveLocationAddresses = giveLocationAddresses;
