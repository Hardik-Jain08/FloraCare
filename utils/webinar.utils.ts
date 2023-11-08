import dayjs from "dayjs";
import { DatoCmsWebinar } from "../../graphql-types";

export const isUpcomingWebinar = (webinar: Partial<DatoCmsWebinar>) => {
  if (!webinar.timeStart) return false;
  return dayjs.utc(webinar.timeStart).subtract(1, "minute").isAfter(dayjs());
};

export const isLiveWebinar = (webinar: Partial<DatoCmsWebinar>) => {
  const isPastStartTime = dayjs
    .utc(webinar.timeStart)
    .subtract(1, "minute")
    .isBefore(dayjs());
  const isOneHourAfterEndTime = dayjs.utc(webinar.timeEnd).isBefore(dayjs());
  return isPastStartTime && !isOneHourAfterEndTime;
};

export const isLiveWebinarOrJustEnded = (webinar: Partial<DatoCmsWebinar>) => {
  const isPastStartTime = dayjs
    .utc(webinar.timeStart)
    .subtract(1, "minute")
    .isBefore(dayjs());
  const isOneHourAfterEndTime = dayjs
    .utc(webinar.timeEnd)
    .add(1, "hour")
    .isBefore(dayjs());
  return isPastStartTime && !isOneHourAfterEndTime;
};

export const isUpcomingOrLiveWebinar = (webinar: Partial<DatoCmsWebinar>) => {
  return isUpcomingWebinar(webinar) || isLiveWebinar(webinar);
};

export const isUpcomingOrLiveWebinarOrJustEnded = (
  webinar: Partial<DatoCmsWebinar>
) => {
  return isUpcomingWebinar(webinar) || isLiveWebinarOrJustEnded(webinar);
};

export const isPastWebinar = (webinar: Partial<DatoCmsWebinar>) => {
  if (webinar.timeEnd)
    return dayjs.utc(webinar.timeEnd).add(15, "minutes").isBefore(dayjs());
  if (webinar.timeStart)
    // presume duration is 1 hour
    return dayjs.utc(webinar.timeStart).add(1, "hour").isBefore(dayjs());
  return false;
};

export const isPastWebinarWithLink = (webinar: Partial<DatoCmsWebinar>) =>
  !!webinar.recordedVideoLink && isPastWebinar(webinar);
