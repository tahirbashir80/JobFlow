"use server";

import { requireTenant } from "@/lib/tenant/require-tenant";
import { getGeoCountries, getGeoStates, getGeoCities } from "./persistence";

export async function getGeoCountriesAction() {
  await requireTenant();
  return getGeoCountries();
}

export async function getGeoStatesAction(countryCode: string) {
  await requireTenant();
  return getGeoStates(countryCode);
}

export async function getGeoCitiesAction(countryCode: string, stateCode: string) {
  await requireTenant();
  return getGeoCities(countryCode, stateCode);
}
