import { Client, EmbedBuilder, TextChannel } from "discord.js";
import db from "tona-db-mini";
import {
  DataCollectionChannelsConfig,
  DataCollections,
  DataCollectionUsers,
  PeriodicEvent,
} from "../models";
import { getAge } from "../utils/date";

const event: PeriodicEvent = {
  name: "birthday",
  trigger: "ON",
  cycle: "DAYS",
  offset: 0,
  executeBefore: false,
  execute(date: Date, client: Client) {
    const channelCollection = db.collection<DataCollectionChannelsConfig>(
      DataCollections.CHANNELS_CONFIG
    );
    const channelId = channelCollection.get({ key: "BIRTHDAYS" })[0]?.channelId;

    if (channelId) {
      const channel = client.channels.cache.get(channelId) as TextChannel;

      const users = db
        .collection<DataCollectionUsers>(DataCollections.USERS)
        .get((u) => {
          const birthdate = new Date(u.birthdate);

          return (
            birthdate.getDate() === date.getDate() &&
            birthdate.getMonth() === date.getMonth()
          );
        });

      users.forEach((user) => {
        channel?.send({
          content: `@everyone`,
          embeds: [
            new EmbedBuilder()
              .setTitle("Anniversaire")
              .setDescription(
                `🎂 Bon anniversaire à ${user.first_name} ${
                  user.discord_id ? `**AKA** <@${user.discord_id}>` : ""
                } !!\nPour ses ${getAge(new Date(user.birthdate))} ans`
              ),
          ],
        });
      });
    }
  },
};

export default event;
