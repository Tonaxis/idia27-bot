import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../models";

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, "..", "events");
  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    const event: BotEvent = require(`${eventsDir}/${file}`).default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }

    console.log(`[HANDLER] 🔔 EVENT ${event.name} loaded`);
  });
};
