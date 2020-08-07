import { log, _ } from "../deps.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<number, Launch>();

export async function downloadLaunchData() {
  log.info("Downloading launch data");
  const response = await fetch("http://api.spacexdata.com/v3/launches");

  if (!response.ok) {
    log.warning("Problem downloading launch data");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers,
    };

    launches.set(flightData.flightNumber, flightData);

    log.info(flightData);
  }
}

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches`);

export function getAll() {
  return Array.from(launches.values());
}

export function getFromId(id: number) {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
}

export function addOne(launch: Launch) {
  launches.set(
    launch.flightNumber,
    Object.assign(launch, {
      upcoming: true,
      customers: ["ZTM", "Tebo", "NASA"],
    }),
  );
}

export function removeOne(id: number) {
  const aborted = launches.get(id);

  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }

  return aborted;
}
