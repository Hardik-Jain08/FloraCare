/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import axios from "axios";
import { isDevelopment } from "../environment";
import { GeolocationCoords } from "../types/helper.types";

export const getUserGeolocation = () =>
  new Promise<
    | (GeolocationCoords & { city?: string; state?: string; country?: string })
    | null
  >((resolve, reject) => {
    if (navigator.geolocation) {
      try {
        if (isDevelopment) console.info("requesting user geolocation...");
        navigator.geolocation.getCurrentPosition(async position => {
          const { latitude, longitude } = position.coords;
          // const [latitude, longitude] = [51.3398584, 12.3755424];
          if (isDevelopment)
            console.info(
              `user geolocation: lat ${latitude}, lng ${longitude}.`
            );
          const { data: geocodedCoordsResponse } = await axios.get<{
            results: google.maps.GeocoderResult[];
          }>(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}`
          );
          const ac =
            geocodedCoordsResponse.results[0]?.address_components ?? [];
          const getAc = (type: string) =>
            ac.find(c => c.types.includes(type))?.long_name;
          const locality = getAc("locality");
          const postalTown = getAc("postal_town");
          const city = locality || postalTown;
          const state = getAc("administrative_area_level_1");
          const country = getAc("country");
          resolve({
            lat: latitude,
            lng: longitude,
            city,
            state,
            country,
          });
        });
      } catch (e) {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
