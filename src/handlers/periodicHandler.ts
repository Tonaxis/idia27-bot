import { Client, Events } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { PeriodicEvent, periodicFunction } from "../models";
import { periodicEvents } from "../singletons";

module.exports = (client: Client) => {
  const periodicEventsDir = join(__dirname, "..", "periodic_events");
  readdirSync(periodicEventsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    const event: PeriodicEvent =
      require(`${periodicEventsDir}/${file}`).default;

    client.once(Events.ClientReady, (...args) => {
      periodicFunction(event, client, ...args);
    });

    periodicEvents.set(event.name, event);

    console.log(`[HANDLER] 🕒 PERIODIC EVENT ${event.name} loaded`);
  });
};
