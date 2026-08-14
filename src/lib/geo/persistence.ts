import {
  getCountries,
  getCountryByCode,
  getStatesOfCountry,
  getStateByCode,
  getCitiesOfState,
} from "@countrystatecity/countries";
import { db } from "@/lib/db/prisma";

type GeoCountry = {
  iso2: string;
  name: string;
  phonecode?: string | null;
};

type GeoState = {
  iso2: string;
  name: string;
};

type GeoCity = {
  name: string;
};

async function country(code?: string): Promise<GeoCountry | null> {
  if (!code) return null;
  const item = await getCountryByCode(code.toUpperCase());
  return item
    ? { iso2: item.iso2, name: item.name, phonecode: item.phonecode ?? null }
    : null;
}

async function countries(): Promise<GeoCountry[]> {
  const value = await getCountries();
  return value.map((item) => ({
    iso2: item.iso2,
    name: item.name,
    phonecode: item.phonecode ?? null,
  }));
}

async function states(code: string): Promise<GeoState[]> {
  const value = await getStatesOfCountry(code.toUpperCase());
  return value.map((item) => ({ iso2: item.iso2, name: item.name }));
}

async function state(code: string, stateCode: string): Promise<GeoState | null> {
  const value = await getStateByCode(code.toUpperCase(), stateCode.toUpperCase());
  return value ? { iso2: value.iso2, name: value.name } : null;
}

async function cities(code: string, stateCode: string): Promise<GeoCity[]> {
  const value = await getCitiesOfState(code.toUpperCase(), stateCode.toUpperCase());
  return value.map((item) => ({ name: item.name }));
}

export async function getGeoCountries() {
  const value = await countries();
  return value
    .map((item) => ({
      code: item.iso2,
      name: item.name,
      phoneCode: item.phonecode ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function ensureGeoCountry(countryCode: string) {
  const item = await country(countryCode);
  if (!item) throw new Error("Country not found.");

  return db.geoCountry.upsert({
    where: { code: item.iso2 },
    update: {
      name: item.name,
      phoneCode: item.phonecode ?? "",
      isActive: true,
    },
    create: {
      code: item.iso2,
      name: item.name,
      phoneCode: item.phonecode ?? "",
    },
  });
}

export async function getGeoStates(countryCode: string) {
  const item = await country(countryCode);
  if (!item) throw new Error("Country not found.");

  return {
    countryId: (await ensureGeoCountry(countryCode)).id,
    states: (await states(countryCode)).map((item) => ({
      code: item.iso2,
      name: item.name,
    })),
  };
}

export async function getGeoCities(countryCode: string, stateCode: string) {
  if (!(await country(countryCode))) throw new Error("Country not found.");

  return (await cities(countryCode, stateCode)).map((item) => ({
    name: item.name,
  }));
}

export async function ensureGeoAddressRefs(
  countryCode?: string,
  stateCode?: string,
  cityName?: string,
  client: any = db,
) {
  if (!countryCode) {
    return { countryId: null, stateId: null, cityId: null };
  }

  const item = await country(countryCode);
  if (!item) throw new Error("Country not found.");

  const dbCountry = await client.geoCountry.upsert({
    where: { code: item.iso2 },
    update: {
      name: item.name,
      phoneCode: item.phonecode ?? "",
      isActive: true,
    },
    create: {
      code: item.iso2,
      name: item.name,
      phoneCode: item.phonecode ?? "",
    },
  });

  let stateId: string | null = null;
  let cityId: string | null = null;

  if (stateCode) {
    const stateItem = await state(countryCode, stateCode);

    if (stateItem) {
      const dbState = await client.geoState.upsert({
        where: {
          countryId_name: {
            countryId: dbCountry.id,
            name: stateItem.name,
          },
        },
        update: {
          code: stateItem.iso2,
          isActive: true,
        },
        create: {
          countryId: dbCountry.id,
          code: stateItem.iso2,
          name: stateItem.name,
        },
      });

      stateId = dbState.id;

      if (cityName) {
        const cityList = await cities(countryCode, stateCode);
        const cityItem = cityList.find(
          (item) => item.name.toLowerCase() === cityName.toLowerCase(),
        );

        if (cityItem) {
          const dbCity = await client.geoCity.upsert({
            where: {
              stateId_name: {
                stateId: dbState.id,
                name: cityItem.name,
              },
            },
            update: {
              isActive: true,
            },
            create: {
              stateId: dbState.id,
              name: cityItem.name,
            },
          });

          cityId = dbCity.id;
        }
      }
    }
  }

  return { countryId: dbCountry.id, stateId, cityId };
}
