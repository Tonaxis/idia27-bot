import { EmbedBuilder } from "discord.js";
import db from "tona-db-mini";
import { DataCollectionWeeks, DataCollections } from "../models";
import { getWeekNumber } from "../utils/date";

export default (...args: any) => {
  const currentYear = new Date().getFullYear();
  const currentWeek = getWeekNumber(new Date());

  const collection = db.collection<DataCollectionWeeks>(DataCollections.WEEKS);
  const remainings = collection.get(
    (w) =>
      (w.year === currentYear && w.week > currentWeek) || w.year >= currentYear
  ).length;

  return {
    embeds: [
      new EmbedBuilder()
        .setTitle("Nombre de semaine de cours restantes")
        .setDescription(
          `> Semaines restantes: **${Math.max(0, remainings)}**\n`
        )
        .setFooter({ text: `Semaines de cours UNIQUEMENT` }),
    ],
  };
};
