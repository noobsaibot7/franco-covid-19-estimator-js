import {
  predictCurrentlyInfected,
  predictInfectionsByRequestedTime,
  predictCasesByRequestedTime,
  predictBedsByRequestedTime,
  predictCasesForICUByRequestedTime,
  predictInfectedRequestedVentilators,
  predictDollarsInFlight
} from './calcs';


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
  return predictDollarsInFlight(infectedRequestedVentilators);
};

export default covid19ImpactEstimator;
