import { Client, EmbedBuilder, TextChannel } from "discord.js";
import db from "tona-db-mini";
import {
  DataCollectionChannelsConfig,
  DataCollections,
  DataCollectionUsers,
  DataCollectionWeeks,
  PeriodicEvent,
} from "../models";
import { getWeekNumber } from "../utils/date";

const event: PeriodicEvent = {
  name: "attendanceRecordManager",
  trigger: "ON",
  cycle: "WEEKS",
  offset: 0,
  executeBefore: false,
  execute(date: Date, client: Client) {
    let year = date.getFullYear();
    let week = getWeekNumber(date);

    const weeksCol = db.collection<DataCollectionWeeks>(DataCollections.WEEKS);
    const usersCol = db.collection<DataCollectionUsers>(DataCollections.USERS);

    const currentDataWeek = weeksCol.get({ year: year, week: week })[0];

    const nextDataWeek = weeksCol
      .get((y) => y.year === year && y.week > week)
      .sort((a, b) => a.year - b.year || a.week - b.week)
      .slice(0, 5);

    const currentDataUser = usersCol.get({
      uid: currentDataWeek?.attendances_record_manager_uid,
    })[0];

    const listOfUids = nextDataWeek.map(
      (week) => week.attendances_record_manager_uid
    );
    const nextDataUsers = usersCol.get((u) => listOfUids.includes(u.uid));

    db.collection<DataCollectionChannelsConfig>(DataCollections.CHANNELS_CONFIG)
      .get()
      .forEach((channel) => {
        (client.channels.cache.get(channel.channelId) as TextChannel)?.send({
          content: currentDataUser.discord_id
            ? `<@${currentDataUser.discord_id}>`
            : "``id discord non renseigné``",
          embeds: [
            new EmbedBuilder()
              .setTitle(`Responsable de la fiche de presences`)
              .setDescription(
                `Semaine \`\`${week}\`\` > **${
                  currentDataUser.first_name
                } ${currentDataUser.last_name.toUpperCase()}**${
                  currentDataUser.discord_id &&
                  ` AKA <@${currentDataUser.discord_id}>`
                }\n\n### Semaines suivantes:\n ${nextDataWeek
                  ?.map((w) => {
                    const user = nextDataUsers.find(
                      (u) => u.uid === w.attendances_record_manager_uid
                    );
                    return `Semaine \`\`${w.week}\`\` > **${user?.first_name} ${
                      user?.last_name
                    }**${
                      user?.discord_id && `${` AKA <@${user?.discord_id}>`}`
                    }`;
                  })
                  .join("\n")}`
              ),
          ],
        });

        if (!currentDataUser?.discord_id || !currentDataUser?.mp) return;
        client.users.fetch(currentDataUser?.discord_id).then((user) => {
          user
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Fiche de presences`)
                  .setDescription(
                    `Hey ! **${currentDataUser.first_name}**,\nC'est à ton tour de d'occuper de la fiche de presences cette semaine !`
                  ),
              ],
            })
            .catch((error) => console.error(error?.message || error));
        });
      });
  },
};

export default event;
