import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { ButtonAction } from "../models";

module.exports = async (client: Client) => {
  const buttonActionsDir = join(__dirname, "../button_actions");

  readdirSync(buttonActionsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    const buttonAction: ButtonAction =
      require(`${buttonActionsDir}/${file}`).buttonAction;

    client.buttonActions.set(buttonAction.name, buttonAction);

    console.log(`[HANDLER] ⏺️  ButtonAction ${buttonAction.name} loaded`);
  });
};
