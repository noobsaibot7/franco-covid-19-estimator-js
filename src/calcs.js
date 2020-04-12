function durationConverter({ periodType, timeToElapse } = {}) {
  switch (periodType) {
    case 'days':
      return Number(timeToElapse);
    case 'weeks':
      return Number(timeToElapse * 7);
    case 'months':
      return Number(timeToElapse * 30);
    default:
      throw Error("periodType must be either 'days', 'weeks' or 'months'.");
  }
}

export function predictCurrentlyInfected(data) {
  const impact = {};
  const severeImpact = {};

  impact.currentlyInfected = Number(data.reportedCases * 10);
  severeImpact.currentlyInfected = Number(data.reportedCases * 50);

  return { data, impact, severeImpact };
}

export function predictInfectionsByRequestedTime({
  data,
  impact,
  severeImpact
}) {
  const numOfDays = durationConverter(data);
  const numOfInfected = 2 ** Math.floor(numOfDays / 3);

  impact.infectionsByRequestedTime = Number(
    impact.currentlyInfected * numOfInfected
  );
  severeImpact.infectionsByRequestedTime = Number(
    severeImpact.currentlyInfected * numOfInfected
  );

  return { data, impact, severeImpact };
}

export function predictCasesByRequestedTime({
  data,
  impact,
  severeImpact
} = {}) {
  impact.severeCasesByRequestedTime = Math.trunc(
    0.15 * impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  return { data, impact, severeImpact };
}

export function predictBedsByRequestedTime({
  data,
  impact,
  severeImpact
} = {}) {
  const remainingBeds = Math.floor(data.totalHospitalBeds * 0.35);

  impact.hospitalBedsByRequestedTime = Number(
    remainingBeds - impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = Number(
    remainingBeds - severeImpact.severeCasesByRequestedTime
  );

  return { data, impact, severeImpact };
}

export function predictCasesForICUByRequestedTime({
  data,
  impact,
  severeImpact
} = {}) {
  impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );

  return { data, impact, severeImpact };
}

export function predictInfectedRequestedVentilators({
  data,
  impact,
  severeImpact
} = {}) {
  impact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  return { data, impact, severeImpact };
}

export function predictDollarsInFlight({ data, impact, severeImpact } = {}) {
  const numOfDays = durationConverter(data);
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  function losses(val) {
    const result = Math.floor(
      (avgDailyIncomePopulation * avgDailyIncomeInUSD) / numOfDays
    );
    return Math.floor(val * result);
  }

  impact.dollarsInFlight = losses(impact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = losses(severeImpact.infectionsByRequestedTime);

  return { data, impact, severeImpact };
}
