import { Client, TextChannel } from "discord.js";
import db from "tona-db-mini";
import statsTrainingProgress from "../messages/statsTrainingProgress";
import { DataCollections, PeriodicEvent } from "../models";
import { DataCollectionStatsMessages } from "../models/dataCollectionStatsMessages";

const event: PeriodicEvent = {
  name: "statsTrainingProgress",
  trigger: "ON",
  cycle: "DAYS",
  offset: 0,
  executeBefore: true,
  execute(date: Date, client: Client) {
    db.collection<DataCollectionStatsMessages>(DataCollections.STATS_MESSAGES)
      .get()
      .forEach((data) => {
        if (data.type !== "TRAINING_PROGRESS") return;

        const channel = client.channels.cache.get(
          data.channelId
        ) as TextChannel;

        channel?.messages
          .fetch(data.messageId)
          .then((message) => {
            message?.edit(statsTrainingProgress());
          })
          .catch(() => {
            console.log(
              `[EVENT:${this.name}] Message ${data.messageId} not found`
            );
          });
      });
  },
};

export default event;
