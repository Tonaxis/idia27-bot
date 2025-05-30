import { Client, Events, Interaction } from "discord.js";
import db from "tona-db-mini";
import { BotEvent, DataCollections } from "../models";
import { DataCollectionStatsMessages } from "../models/dataCollectionStatsMessages";

const event: BotEvent = {
  name: Events.MessageDelete,
  once: false,
  async execute(client: Client, interaction: Interaction) {
    const collection = db.collection<DataCollectionStatsMessages>(
      DataCollections.STATS_MESSAGES
    );
    collection.del({ messageId: interaction.id });
  },
};

export default event;
