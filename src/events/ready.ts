import { Client, Events } from "discord.js";
import { BotEvent } from "../models";

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`[EVENT:${this.name}] 🚀 ${client.user?.username} READY`);
  },
};

export default event;
