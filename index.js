const {
  generateClientDetailsFromFormstateAndPermanentCodeDetails,
  getAnswerValue,
  getOperationListProspectDoc,
  convertCoversArrayToObject,
  getCalculateVerticalIdFromProspectDoc,
  MASTERGROUP,
  OPERATION,
  LOCATION,
} = require("./src/frontEndFunctions");
const { convertFormStateToCleanedAnswer } = require("./src/giveCleanedAnswer");
const {
  LOCATION_COVERS_TYPECODE,
  ADDRESS_PARTS,
  QUOTES_BY,
  COVERMATCH_COVER_ID,
  MARKET_TYPE,
} = require("./src/hardcodedconstants");
const { giveLocationAddresses } = require("./src/locationAddress");

module.exports.convertFormStateToCleanedAnswer =
  convertFormStateToCleanedAnswer;
module.exports.giveLocationAddresses = giveLocationAddresses;
module.exports.generateClientDetailsFromFormstateAndPermanentCodeDetails =
  generateClientDetailsFromFormstateAndPermanentCodeDetails;
module.exports.getAnswerValue = getAnswerValue;
module.exports.getOperationListProspectDoc = getOperationListProspectDoc;
module.exports.convertCoversArrayToObject = convertCoversArrayToObject;
module.exports.getCalculateVerticalIdFromProspectDoc =
  getCalculateVerticalIdFromProspectDoc;

module.exports.MASTERGROUP = MASTERGROUP;
module.exports.OPERATION = OPERATION;
module.exports.LOCATION = LOCATION;

module.exports.LOCATION_COVERS_TYPECODE = LOCATION_COVERS_TYPECODE;
module.exports.ADDRESS_PARTS = ADDRESS_PARTS;
module.exports.QUOTES_BY = QUOTES_BY;
module.exports.COVERMATCH_COVER_ID = COVERMATCH_COVER_ID;
module.exports.MARKET_TYPE = MARKET_TYPE;
