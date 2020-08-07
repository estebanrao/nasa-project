import { assertEquals } from "../test_deps.ts";

import { filterHabitablePlanets } from "./planets.ts";

const HABITABLE_PLANET = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1",
};

const NOT_CONFIRMED = {
  "koi_disposition": "FALSE POSITIVE",
};

const TOO_LARGE_PRAD = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1.5",
  "koi_smass": "1",
  "koi_srad": "1",
};

const TOO_LARGE_SRAD = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1.01",
};

const TOO_LARGE_SMASS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1.04",
};

Deno.test("filter only habitable planets", () => {
  const filtered = filterHabitablePlanets(
    [
      HABITABLE_PLANET,
      NOT_CONFIRMED,
      TOO_LARGE_PRAD,
      TOO_LARGE_SRAD,
      TOO_LARGE_SMASS,
    ],
  );

  assertEquals(filtered, [HABITABLE_PLANET]);
});
