// function that will take permanent code details and give a simplified form in answers

const generateClientDetailsFromFormstateAndPermanentCodeDetails = ({
  permanentcodedetails,
  formstate,
}) => {
  let clientdetailstosend = {};

  if (permanentcodedetails) {
    try {
      for (let permanentcode in permanentcodedetails) {
        let { formid, id } = permanentcodedetails[permanentcode];

        clientdetailstosend[permanentcode] = formstate[formid].nodestate[id]
          ? formstate[formid].nodestate[id].answer
            ? formstate[formid].nodestate[id].answer
            : ""
          : "";
      }
    } catch (er) {
      return {};
    }
  }

  return clientdetailstosend;
};

const addressParts = {
  country: "country",
  postalcode: "postalcode",
  streetNumber: "streetNumber",
  street: "street",
  province: "province",
  town: "town",
};

const getAddressInFormattedForm = ({ node }) => {
  try {
    if (node.type === "address") {
      return `${
        node.answer[addressParts.streetNumber]
          ? node.answer[addressParts.streetNumber]
          : ""
      } ${
        node.answer[addressParts.street]
          ? node.answer[addressParts.street] + ","
          : ""
      } ${
        node.answer[addressParts.town]
          ? node.answer[addressParts.town] + ","
          : ""
      } ${
        node.answer[addressParts.province]
          ? node.answer[addressParts.province] + ","
          : ""
      } ${
        node.answer[addressParts.country]
          ? node.answer[addressParts.country] + "."
          : ""
      } ${
        node.answer[addressParts.postalcode]
          ? node.answer[addressParts.postalcode]
          : ""
      }`;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getAnswerValue = ({ node, formstate }) => {
  try {
    if (node.type === "address") {
      return getAddressInFormattedForm({
        node: formstate[node.formid].nodestate[node.id],
      });
    }
    return formstate[node.formid].nodestate[node.id].answer;
  } catch (error) {
    return null;
  }
};

const getOperationListProspectDoc = (prospectdoc) => {
  return prospectdoc.answers.operations.list;
};

const getCalculateVerticalIdFromProspectDoc = (prospectdoc) => {
  return prospectdoc?.answers?.calculatedverticalid;
};

const convertCoversArrayToObject = ({ coversArray }) => {
  let coversObject = {};

  coversArray.forEach((covervalue, index) => {
    coversObject[index + 1] = covervalue;
  });

  return coversObject;
};

//front end hardwiredlogic businesslogic variables
const MASTERGROUP = "mastergroup";
const OPERATION = "operation";
const LOCATION = "location";

exports.generateClientDetailsFromFormstateAndPermanentCodeDetails =
  generateClientDetailsFromFormstateAndPermanentCodeDetails;

exports.getAnswerValue = getAnswerValue;
exports.getOperationListProspectDoc = getOperationListProspectDoc;
exports.convertCoversArrayToObject = convertCoversArrayToObject;
exports.getCalculateVerticalIdFromProspectDoc =
  getCalculateVerticalIdFromProspectDoc;

exports.MASTERGROUP = MASTERGROUP;
exports.OPERATION = OPERATION;
exports.LOCATION = LOCATION;
