import { isBuildTime } from "../environment";
import { EventDirectoryItem } from "../types/helper.types";
import { runAfter } from "./promises.utils";
import { loadScript } from "./script.utils";

type MapType = InstanceType<typeof google.maps.Map>;
type MarkerType = InstanceType<typeof google.maps.Marker>;

const mapsInitiated = new Map<string, MapController>();

const defaultCenterCoords = { lat: 47.56, lng: -53.96 };
const getDefaultZoom = () =>
  isBuildTime
    ? 3
    : window.innerWidth < 768
    ? window.innerWidth < 480
      ? 1
      : 2
    : 3;

export const initEventDirectoryMapInElement = (
  id: string,
  container: HTMLDivElement,
  items: EventDirectoryItem[],
  onSelectItem?: (item: EventDirectoryItem) => void
) =>
  new Promise<MapController>((resolve, reject) => {
    const existing = mapsInitiated.get(id);
    if (existing) {
      container.appendChild(existing.el);
      existing.onSelectItem = onSelectItem;
      existing.markers.forEach(marker => {
        const item = items.find(i => i.name === marker.getTitle());
        if (item)
          marker.addListener("click", () => {
            existing.onSelectItem?.(item);
          });
      });
      if (items.length === 1) {
        runAfter(() => {
          existing.panToItemMarker(items[0], google.maps.Animation.DROP);
        });
      } else {
        existing.map?.setCenter(defaultCenterCoords);
        existing.map?.setZoom(getDefaultZoom());
      }
      resolve(existing);
      return;
    }
    const el = document.createElement("div");
    container.appendChild(el);
    const callbacksOnReady: (() => unknown)[] = [];
    const s: MapController = {
      map: null,
      el,
      itemsWithCoords: items.filter(i => !!i.place?.coordinates),
      markers: [],
      onSelectItem,
      panToItemMarker: (item, animation) => {
        s.markers.forEach(m => m.setAnimation(null));
        const index = s.itemsWithCoords.indexOf(item);
        const marker = s.markers[index];
        if (!s.map) return;
        if (item.place?.coordinates) {
          if (animation && marker) {
            marker.setAnimation(animation);
            runAfter(() => marker.setAnimation(null), 3000);
          }
          s.map.panTo(item.place.coordinates);
          if (s.map.getZoom() < 12) s.map.setZoom(12);
        } else {
          s.resetView();
        }
      },
      resetView: () => {
        if (!s.map) return;
        s.map.setZoom(getDefaultZoom());
        s.map.panTo(defaultCenterCoords);
      },
      onReady: (fn: () => unknown) => {
        if (s.map) fn();
        else callbacksOnReady.push(fn);
      },
    };
    resolve(s);
    const initMap = () => {
      s.map = new google.maps.Map(el, {
        center: defaultCenterCoords,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoom: getDefaultZoom(),
        zoomControl: false,
        maxZoom: 17,
        styles: [
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
      s.markers = s.itemsWithCoords
        .map(item => {
          const marker = new google.maps.Marker({
            position: item.place!.coordinates,
            map: s.map!,
            title: item.name,
          });
          marker.addListener("click", () => {
            s.onSelectItem?.(item);
          });
          return marker;
        })
        .filter(i => i);
      mapsInitiated.set(id, s);
      if (items.length === 1) {
        runAfter(() => {
          s.panToItemMarker(items[0], google.maps.Animation.DROP);
        });
      }
      callbacksOnReady.forEach(callback => callback());
    };
    loadScript({
      src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`,
      onError: e => reject("Google Maps API failed to load"),
      onLoad: initMap,
    });
  });

export type MapController = {
  map: null | MapType;
  el: HTMLDivElement;
  itemsWithCoords: EventDirectoryItem[];
  markers: MarkerType[];
  panToItemMarker: (
    item: EventDirectoryItem,
    animation?: google.maps.Animation
  ) => void;
  onSelectItem?: (item: EventDirectoryItem) => void;
  onReady: (fn: () => unknown) => void;
  resetView: () => void;
};
