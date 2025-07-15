// Purpose: Convert any Prospect's Formstate to CleanedAnswer

const _ = require("lodash");

const convertFormStateToCleanedAnswer = ({
  formstate,
  formsorder,
  answers,
}) => {
  // STEP 1: loop every form in formsorder and second loop will be to loop every node inside nodestate

  let cleanedAnswer = {};

  if (_.isEmpty(formsorder) || !Array.isArray(formsorder)) return cleanedAnswer;

  formsorder.forEach((formid) => {
    if (formstate[formid]) {
      let nodesorder = formstate[formid].nodesorder;
      let nodestate = formstate[formid].nodestate;

      if (!_.isEmpty(nodesorder) && Array.isArray(nodesorder)) {
        nodesorder.forEach((nodeid) => {
          try {
            if (conversionFunctionForEachType[nodestate[nodeid].type]) {
              if ("answer" in nodestate[nodeid]) {
                cleanedAnswer[nodeid] = conversionFunctionForEachType[
                  nodestate[nodeid].type
                ]({
                  answer: nodestate[nodeid].answer,
                  cleanedAnswer,
                  nodeid,
                });
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
    }
  });

  // STEP 2: ADD ANSWER : operation_1 from answers object of the prospect column
  addOperationCodes({ answers, cleanedAnswer });

  addCalculatedVerticalId({ answers, cleanedAnswer });
  parseOperationTable({formstate, cleanedAnswer, answers})

  return { ...cleanedAnswer };
};

//   singleselect,
//   singleselectplatinum,
const singleSelectConversion = ({ answer }) => {
  // support for saveas

  if (answer?.saveas) return answer.saveas;

  if (answer?.text?.en) return answer.text.en;

  return null;
};

//   multiselect,
//   multiselectplatinum,
const mulitSelectConversion = ({ answer }) => {
  try {
    let aSingleString = "";
    answer.forEach((option) => {
      aSingleString = aSingleString
        ? aSingleString + "___" + option.text.en
        : option.text.en;
    });

    return aSingleString;
  } catch (e) {
    return null;
  }
};
const mulitTextConversion = ({ answer }) => {
  try {
    let aSingleString = "";
    aSingleString = answer;  

    return aSingleString;
  } catch (e) {
    return null;
  }
};
//   address,
const addressConversion = ({ answer, cleanedAnswer, nodeid }) => {
  try {
    for (let key in answer) {
      if (key !== "detail") {
        cleanedAnswer[`${nodeid}_${key}`] = answer[key];
      }
    }

    return null;
  } catch (er) {
    return null;
  }
};

//   schedule
const scheduleCoversion = ({ answer }) => {
  try {
    let mainAnswer = answer.mainanswer;
    return mainAnswer;
  } catch (e) {
    return null;
  }
};

// TODO : These  left
//   multistring,
//   date

////////////////////////////////////////////////////////////////////
//   simplestring,
//   yesno,
//   largestring,
//   year,
//   email,
//   percentage,
//   number,
//   contact,
//   currency,
const directConversion = ({ answer }) => {
  return answer;
};

const conversionFunctionForEachType = {
  // simple direct conversion where whatever answer is we have to return that
  simplestring: directConversion,
  yesno: directConversion,
  largestring: directConversion,
  year: directConversion,
  email: directConversion,
  percentage: directConversion,
  number: directConversion,
  contact: directConversion,
  currency: directConversion,
  date: directConversion,

  // some special conversion need special functions
  singleselect: singleSelectConversion,
  singleselectplatinum: singleSelectConversion,
  multiselect: mulitSelectConversion,
  multitext: mulitTextConversion,
  multiselectplatinum: mulitSelectConversion,
  schedule: scheduleCoversion,
  address: addressConversion,
};

/////////////////////////////////////////////////////

// This will add operaiton_1, operation_2, ... and so on to the list
/////////////////////////////////////////////////////
const addOperationCodes = ({ answers, cleanedAnswer }) => {
  // the operations in the answer is having the same index as per the listed answer
  // this is verified and true code
  // So, index + 1 will give exact operation ids

  try {
    answers.operations.list.forEach((operation, index) => {
      cleanedAnswer[`operation_${index + 1}`] = operation.id;
    });

    return;
  } catch (e) {
    return;
  }
};

const addCalculatedVerticalId = ({ answers, cleanedAnswer }) => {
  // the operations in the answer is having the same index as per the listed answer
  // this is verified and true code
  // So, index + 1 will give exact operation ids

  try {
    cleanedAnswer["calculatedverticalid"] = answers.calculatedverticalid;
    return;
  } catch (e) {
    return;
  }
};

const parseOperationTable = ({formstate, cleanedAnswer, answers}) => {
  try {
    let nodeKey = "461";
    if(answers.selectedverticalid !== 1 ){
      nodeKey = "464";
    }
    const operationTableAnswer = formstate['c']?.nodestate?.[nodeKey]?.answer
    const logicRowsData = formstate['c']?.nodestate?.[nodeKey]?.logic?.rowData;
    const operationNames = answers.operations.list
      .filter(item => item.name?.en)
      .map(item => item.name.en);
    if(!operationTableAnswer) return
   
    for(let logicData of logicRowsData){
      if(logicData.type == 'header'){
        continue;
      }
      let dict_key = logicData.text;
      let op_counter = 1;
      for(let opkey in operationTableAnswer[dict_key]){
        //if(opkey == 'Total') continue;
        op_counter = operationNames.indexOf(opkey) + 1;
        if(![null, ''].includes(operationTableAnswer[dict_key][opkey])){
          if(op_counter == 0 && opkey != 'Total') continue; // skip if operation isnt in answer array and isnt total
          if(opkey == 'Total'){
            cleanedAnswer[`operation_total_${logicData.id}`] = parseFloat(operationTableAnswer[dict_key][opkey].replace(/,/g, ''));
            continue;
          }
          else if([true, false, "Yes", "No"].includes(operationTableAnswer[dict_key][opkey])){
            cleanedAnswer[`operation_${op_counter}_${logicData.id}`] = operationTableAnswer[dict_key][opkey];
          }
          else  
            cleanedAnswer[`operation_${op_counter}_${logicData.id}`] = parseFloat(operationTableAnswer[dict_key][opkey].replace(/,/g, ''));
        }
        //op_counter += 1;
      }
    }
    return;
  } catch (e) {
    console.log("SOMETHING FIALED (E)")
    console.log(e)
    return;
  }
}
// also add calculated verticalid

// export the main function
exports.convertFormStateToCleanedAnswer = convertFormStateToCleanedAnswer;
