/* eslint-disable @typescript-eslint/no-unsafe-argument */
import dayjs from "dayjs";
import { DatoCmsEvent } from "../../graphql-types";

export const eventIsOpenForRegistration = (event: DatoCmsEvent) => {
  const { timeRegistrationEnd, registrationOpen, timeStart } = event;
  if (timeRegistrationEnd) {
    const regHasClosed = dayjs(timeRegistrationEnd).isBefore(dayjs());
    if (regHasClosed) return false;
    return true;
  } else if (timeStart) {
    const eventHasStarted = dayjs(timeStart).isBefore(dayjs());
    if (eventHasStarted) return false;
  }
  return registrationOpen;
};

export const eventIsAllDayOrMultiDayEvent = (event: {
  timeStart?: string | null;
  timeEnd?: string | null;
}) => {
  if (!event.timeStart || !event.timeEnd) return false;
  return dayjs(event.timeEnd).diff(event.timeStart, "hours") > 20;
};
