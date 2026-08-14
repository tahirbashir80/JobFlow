"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Settings2 } from "lucide-react";

type LocationValue = {
  addressLine1: string;
  cityName: string;
  stateName: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
};

export function GoogleMapPicker({ onLocation }: { onLocation: (value: LocationValue) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading map…");
  const markerRef = useRef<any>(null);
  const mapRefInstance = useRef<any>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setMessage("Google Maps API key is not configured. Coordinates can still be entered manually.");
      return;
    }
    const existing = document.querySelector('script[data-jobflow-google-maps="true"]') as HTMLScriptElement | null;
    const init = () => {
      if (!mapRef.current || !(window as any).google?.maps) return;
      const google = (window as any).google;
      const center = { lat: 25.2048, lng: 55.2708 };
      const map = new google.maps.Map(mapRef.current, { center, zoom: 11, streetViewControl: false, mapTypeControl: false, fullscreenControl: false });
      const marker = new google.maps.Marker({ map, position: center, draggable: true });
      mapRefInstance.current = map; markerRef.current = marker; setReady(true); setMessage("Drag the pin to the customer location.");

      const geocoder = new google.maps.Geocoder();
      const reverse = (position: any) => {
        geocoder.geocode({ location: position }, (results: any[], status: string) => {
          if (status !== "OK" || !results?.[0]) return;
          const components = results[0].address_components ?? [];
          const pick = (type: string) => components.find((c: any) => c.types.includes(type));
          const country = pick("country"); const state = pick("administrative_area_level_1"); const city = pick("locality") || pick("postal_town") || pick("administrative_area_level_2");
          const streetNumber = pick("street_number")?.long_name || "";
          const route = pick("route")?.long_name || "";
          const addressLine1 = [streetNumber, route].filter(Boolean).join(" ") || results[0].formatted_address || "";
          onLocation({ addressLine1, cityName: city?.long_name || "", stateName: state?.long_name || "", countryCode: country?.short_name || "", latitude: position.lat(), longitude: position.lng(), googlePlaceId: results[0].place_id || "" });
        });
      };
      marker.addListener("dragend", () => reverse(marker.getPosition()));
      map.addListener("click", (event: any) => { marker.setPosition(event.latLng); reverse(event.latLng); });
    };
    if (existing) { if ((window as any).google?.maps) init(); else existing.addEventListener("load", init, { once: true }); return; }
    const script = document.createElement("script"); script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`; script.async = true; script.defer = true; script.dataset.jobflowGoogleMaps = "true"; script.addEventListener("load", init, { once: true }); document.head.appendChild(script);
    return () => script.removeEventListener("load", init);
  }, [onLocation]);

  return <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]">
    <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2.5 text-[10px] font-semibold text-[var(--muted)]"><MapPin size={13}/> {message}</div>
    <div ref={mapRef} className="h-[230px] w-full" />
    {!ready && <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] text-[var(--muted)]"><Settings2 size={12}/> Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive picker.</div>}
  </div>;
}
