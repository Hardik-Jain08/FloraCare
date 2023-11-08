import dayjs, { extend } from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { isBrowser } from "../environment";

extend(utc);
extend(timezone);
extend(localizedFormat);
extend(duration);
extend(relativeTime);
extend(advancedFormat);

export function initDayJS() {
  // noop
}

export const MMMMDYYYY = "MMMM D, YYYY";
export const guessBrowserTimezone = () =>
  isBrowser ? dayjs.tz.guess() : "Europe/Dublin";

export const TimezoneConversionMap = {
  "New York": "US Eastern",
  Chicago: "US Central",
  Denver: "US Mountain",
  "Los Angeles": "US Pacific",
  Anchorage: "Alaska",
  Honolulu: "Hawaii-Aleutian",
} as Record<string, string>;

export const TimetableTimezones = {
  UTC: "UTC",
  DUB: "Europe/Dublin",
  ET: "America/New_York",
  CT: "America/Chicago",
  MT: "America/Denver",
  PT: "America/Los_Angeles",
};

export const TimezoneConversionMapReversed = {
  UTC: "UTC",
  Dublin: "Europe/Dublin",
  "US Eastern": "America/New_York",
  "US Central": "America/Chicago",
  "US Mountain": "America/Denver",
  "US Pacific": "America/Los_Angeles",
  Alaska: "America/Anchorage",
  "Hawaii-Aleutian": "Pacific/Honolulu",
} as Record<string, string>;

export const getTimezoneAbbreviation = (name: string) => {
  if (
    [
      "Eastern Time",
      "Eastern Daylight Time",
      "Central Time",
      "Central Daylight Time",
      "Mountain Time",
      "Mountain Daylight Time",
      "Pacific Time",
      "Pacific Daylight Time",
    ].includes(name)
  )
    return name
      .split(" ")
      .map(word => word[0])
      .join("");
  return name;
};

export const getReadableTimezoneName = (timezoneName: string) => {
  const value = timezoneName?.replace(/^[^/]*\//, "").replace(/_/g, " ");
  return TimezoneConversionMap[value] ?? value;
};
export const getStandardTimezoneFromReadable = (name?: string | null) => {
  return name ? TimezoneConversionMapReversed[name] ?? name : name;
};

export const getDuration = (
  timeStart: string,
  timeEnd: string,
  as?: "hours" | "minutes" | "seconds" | "milliseconds"
) => {
  return dayjs.duration(dayjs(timeEnd).diff(timeStart)).as(as ?? "hours");
};

export const getHumanizedDuration = (timeStart: string, timeEnd: string) => {
  const durationMin = dayjs
    .duration(dayjs(timeEnd).diff(timeStart, "minutes"), "minutes")
    .asMinutes();
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;
  return [
    hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
    minutes ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : "",
  ].join(" ");
};
