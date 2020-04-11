import {
  predictCurrentlyInfected,
  predictInfectionsByRequestedTime,
  predictCasesByRequestedTime,
  predictBedsByRequestedTime,
  predictCasesForICUByRequestedTime,
  predictInfectedRequestedVentilators,
  predictDollarsInFlight
} from './calcs';
/*
{
region: {
name: "Africa",
avgAge: 19.7,
avgDailyIncomeInUSD: 5,
avgDailyIncomePopulation: 0.71
},
periodType: "days",
timeToElapse: 58,
reportedCases: 674,
population: 66622705,
totalHospitalBeds: 1380614
}
===================================================
{
 data: {}, // the input data you got
 impact: {}, // your best case estimation
 severeImpact: {} // your severe case estimation
}
*/

const covid19ImpactEstimator = (data) => {
  const currentlyInfected = predictCurrentlyInfected(data);
  const infectionsByRequestedTime = predictInfectionsByRequestedTime(
    currentlyInfected
  );
  const casesByRequestedTime = predictCasesByRequestedTime(
    infectionsByRequestedTime
  );
  const bedsByRequestedTime = predictBedsByRequestedTime(casesByRequestedTime);
  const casesForICUByRequestedTime = predictCasesForICUByRequestedTime(
    bedsByRequestedTime
  );
  const infectedRequestedVentilators = predictInfectedRequestedVentilators(
    casesForICUByRequestedTime
  );
  predictDollarsInFlight(infectedRequestedVentilators);
};

export default covid19ImpactEstimator;
