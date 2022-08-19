const LOCATION_COVERS_TYPECODE = "LOCATION";

const ADDRESS_PARTS = {
  streetNumber: "streetNumber",
  street: "street",
  town: "town",
  province: "province",
  country: "country",
  postalcode: "postalcode",
};

const QUOTES_BY = ["manual", "inhouse", "external"];
const MARKET_TYPE = { contract: true, openmarket: false };
const COVERMATCH_COVER_ID = 5;

exports.LOCATION_COVERS_TYPECODE = LOCATION_COVERS_TYPECODE;
exports.ADDRESS_PARTS = ADDRESS_PARTS;
exports.QUOTES_BY = QUOTES_BY;
exports.COVERMATCH_COVER_ID = COVERMATCH_COVER_ID;
exports.MARKET_TYPE = MARKET_TYPE;
