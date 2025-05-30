import { EmbedBuilder } from "discord.js";

export default (...args: any) => {
  const start = new Date("2024-09-16");
  const end = new Date("2027-09-15");
  const now = new Date();

  const percent = Math.min(
    100,
    Math.max(
      0,
      ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) *
        100
    )
  );

  const length = 25;

  return {
    embeds: [
      new EmbedBuilder()
        .setTitle("Progression de la formation")
        .setDescription(
          `## Poucentage accompli: **${percent.toFixed(
            2
          )}%**\n> Jours restants: **${Math.max(
            0,
            Math.ceil((end.getTime() - now.getTime()) / 86400000)
          )}j**\n\`\`\`ansi\n[2;32m${"▰".repeat(
            Math.floor(percent / (100 / length))
          )}[0m${"▱".repeat(
            length - Math.floor(percent / (100 / length))
          )}\n\`\`\``
        )
        .setFooter({ text: `Formation complète (cours et entreprise)` }),
    ],
  };
};
