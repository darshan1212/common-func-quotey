// Purpose: Convert any Prospect's formstate to location's addressess as per the business logic mentioned in one of the image of  QUOTEY-108 jira story as it is required in many parts in app

const { LOCATION } = require("./frontEndFunctions");
const { ADDRESS_PARTS } = require("./hardcodedconstants");
const { convertFormStateToCleanedAnswer } = require("./giveCleanedAnswer");

// function will return null if there are no location form

// Questions for most of verticals. Lets say it as Group A
const QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS = "500100";
const QUESTION_WHAT_IS_LOCATION_ADDRESS = "500110";
const QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS = "10505";

// Question for vertical that are not same as general ones. Lets say it as Group B
const QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL = "500101";
const QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL = "68497";

const buildAddressParts = ({
  addressPartsHardCoded,
  questionidstring,
  cleanedAnswers,
}) => {
  let finalAddressParts = {};
  for (let addresspart in addressPartsHardCoded) {
    let finalQuestionId = `${questionidstring}_${addressPartsHardCoded[addresspart]}`;

    if (finalQuestionId in cleanedAnswers) {
      finalAddressParts[addressPartsHardCoded[addresspart]] =
        cleanedAnswers[finalQuestionId];
    }
  }

  return finalAddressParts;
};

const giveLocationAddresses = ({ formstate, formsorder, answers }) => {
  let returnObject = {};
  try {
    let locationformid = null;
    for (let formid in formstate) {
      if (formstate[formid].type === LOCATION) {
        locationformid = formid;
      }
    }

    if (locationformid === null) return null;

    returnObject["order"] = formstate[locationformid]["locationsorder"];

    // make the returnObject.state which contain answer to the address part of the location quotey-108

    // initialize state for every locationorder
    returnObject.state = {};
    returnObject.order.forEach((locationid) => {
      returnObject.state[locationid] = { address: null };
    });

    let cleanedAnswers = convertFormStateToCleanedAnswer({
      formstate,
      formsorder,
      answers,
    });

    // AS PER THE LOGIC CHART MENTIONED IN MIRO OR IMAGE IN QUOTEY-169 :

    //#region  Defining all the decision vairables
    const IS_QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_PRESENT =
      QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS in cleanedAnswers;
    const IS_QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_PRESENT =
      QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL in
      cleanedAnswers;
    //#endregion

    //#region Answer Nodes === Leaf Nodes of the tree mentioned in Quotey-169
    const LEAF_1 = () =>
      buildAddressParts({
        cleanedAnswers,
        questionidstring: QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS,
        addressPartsHardCoded: ADDRESS_PARTS,
      });

    const LEAF_2 = ({ this_QUESTION_WHAT_IS_LOCATION_ADDRESS_id }) =>
      buildAddressParts({
        cleanedAnswers,
        questionidstring: this_QUESTION_WHAT_IS_LOCATION_ADDRESS_id,
        addressPartsHardCoded: ADDRESS_PARTS,
      });

    const LEAF_3 = () =>
      buildAddressParts({
        cleanedAnswers,
        questionidstring:
          QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL,
        addressPartsHardCoded: ADDRESS_PARTS,
      });

    const LEAF_4 = () => null;
    //#endregion

    returnObject.order.forEach((locationid) => {
      // if there is no location_n_500100 in cleaned answer return "" empty string
      let this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_id = `location_${locationid}_${QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS}`;
      let this_QUESTION_WHAT_IS_LOCATION_ADDRESS_id = `location_${locationid}_${QUESTION_WHAT_IS_LOCATION_ADDRESS}`;
      let this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id = `location_${locationid}_${QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL}`;

      const is_this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_id_present =
        this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_id in cleanedAnswers;
      const is_this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id_present =
        this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id in
        cleanedAnswers;

      if (is_this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_id_present) {
        if (
          cleanedAnswers[this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_id] ===
          "No"
        ) {
          returnObject.state[locationid].address = LEAF_2({
            this_QUESTION_WHAT_IS_LOCATION_ADDRESS_id,
          });
        } else {
          returnObject.state[locationid].address = LEAF_1();
        }
      } else {
        if (IS_QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_PRESENT) {
          returnObject.state[locationid].address = LEAF_1();
        } else {
          let tempBoolean = false;
          if (
            is_this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id_present
          ) {
            if (
              cleanedAnswers[
                this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id
              ] === "No"
            ) {
              returnObject.state[locationid].address = LEAF_2({
                this_QUESTION_WHAT_IS_LOCATION_ADDRESS_id,
              });
            } else {
              tempBoolean = true; // to follow DRY principle
            }
          }

          if (
            !is_this_QUESTION_SAME_AS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_id_present ||
            tempBoolean
          ) {
            if (
              IS_QUESTION_WHAT_IS_CORRESPONDENCE_ADDRESS_FOR_DIFFERENT_VERTICAL_PRESENT
            ) {
              returnObject.state[locationid].address = LEAF_3();
            } else {
              returnObject.state[locationid].address = LEAF_4();
            }
          }
        }
      }
    });

    return returnObject;
  } catch (e) {
    return null;
  }
};

exports.giveLocationAddresses = giveLocationAddresses;
