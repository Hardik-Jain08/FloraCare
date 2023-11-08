import axios from "axios";

const locateResult = {
  countryCode: "",
  city: "",
  regionName: "",
};

export const locateUserIP = () =>
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  new Promise<typeof locateResult>(async resolve => {
    if (locateResult.countryCode) {
      resolve(locateResult);
      return;
    }
    if (process.env.CI) {
      resolve({
        countryCode: "US",
        city: "Boston",
        regionName: "Massachusetts",
      });
      return;
    }
    const { data } = await axios.get<{
      countryCode: string;
      city: string;
      regionName: string;
    }>(`/api/utils/locate-ip`);
    Object.assign(locateResult, data);
    resolve(locateResult);
  });

export const EUCountryCodes = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
];

export const EEACountryCodes = [
  ...EUCountryCodes,
  "IS", // Iceland
  "NO", // Norway
  "LI", // Liechtenstein
];

export const isEUCountryCode = (code: string) => {
  return EUCountryCodes.includes(code.toUpperCase());
};
export const isEEACountryCode = (code: string) => {
  return EEACountryCodes.includes(code.toUpperCase());
};

export const isPostCodeRequiredCountry = (country: string) =>
  ["Ireland", "United Kingdom", "United States"].includes(country);

export const getRegionFieldLabel = (country: string) => {
  switch (country) {
    case "Ireland":
    case "United Kingdom":
      return "County";
    case "United States":
      return "State";
    default:
      return "County/State/Region";
  }
};

export const getPostCodeFieldLabel = (country: string) => {
  switch (country) {
    case "Ireland":
      return "Eircode";
    case "United States":
      return "ZIP code";
    default:
      return "Postcode";
  }
};
