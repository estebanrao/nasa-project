import { join, BufReader, parse, _ } from "../deps.ts";

type Planet = Record<string, string>;

let planets: Array<Planet>;

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    const disposition = planet["koi_disposition"];
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarRadius = Number(planet["koi_srad"]);
    const stellarMass = Number(planet["koi_smass"]);

    return disposition === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      stellarRadius > 0.99 && stellarRadius < 1.01 &&
      stellarMass > 0.78 && stellarMass < 1.04;
  });
}

async function loadPlanetsData() {
  const path = join("data", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  Deno.close(file.rid);

  const planets = filterHabitablePlanets(result as Array<Planet>);

  return planets.map((planet) => {
    return _.pick(planet, [
      "kepler_name",
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "koi_count",
      "koi_steff",
    ]);
  });
}

planets = await loadPlanetsData();

export function getAllPlanets() {
  return planets;
}
