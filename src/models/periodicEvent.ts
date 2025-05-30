import { getWeekNumber } from "../utils/date";

export type PeriodicEvent = {
  name: string;
  trigger: "EVERY" | "ON";
  cycle:
    | "SECONDS"
    | "MINUTES"
    | "HOURS"
    | "DAYS"
    | "WEEKS"
    | "MONTHS"
    | "YEARS";
  offset: number;
  executeBefore: boolean;
  execute(...args: any[]): void;
};

export function periodicFunction(event: PeriodicEvent, ...args: any[]) {
  let previousDate = new Date();

  let intervalSeconds = 10;

  if (event.trigger === "EVERY") {
    switch (event.cycle) {
      case "YEARS":
        intervalSeconds = 31536000;
        break;
      case "MONTHS":
        intervalSeconds = 2592000;
        break;
      case "WEEKS":
        intervalSeconds = 604800;
        break;
      case "DAYS":
        intervalSeconds = 86400;
        break;
      case "HOURS":
        intervalSeconds = 3600;
        break;
      case "MINUTES":
        intervalSeconds = 60;
        break;
      case "SECONDS":
        intervalSeconds = 1;
        break;
    }
  }

  if (event.executeBefore) {
    event.execute(previousDate, ...args);
  }

  setInterval(() => {
    if (event.trigger === "ON") {
      const currentDate = new Date();
      let dateAtStartCycle: Date;

      let trigger = false;

      switch (event.cycle) {
        case "YEARS":
          trigger = currentDate.getFullYear() !== previousDate.getFullYear();
          dateAtStartCycle = new Date(previousDate.getFullYear(), 1, 1);
          break;
        case "MONTHS":
          trigger = currentDate.getMonth() !== previousDate.getMonth();
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            1
          );
          break;
        case "WEEKS":
          trigger = getWeekNumber(currentDate) !== getWeekNumber(previousDate);
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            previousDate.getDate() - previousDate.getDay()
          );
          break;
        case "DAYS":
          trigger = currentDate.getDate() !== previousDate.getDate();
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            previousDate.getDate()
          );
          break;
        case "HOURS":
          trigger = currentDate.getHours() !== previousDate.getHours();
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            previousDate.getDate(),
            previousDate.getHours()
          );
          break;
        case "MINUTES":
          trigger = currentDate.getMinutes() !== previousDate.getMinutes();
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            previousDate.getDate(),
            previousDate.getHours(),
            previousDate.getMinutes()
          );
          break;
        case "SECONDS":
          trigger = currentDate.getSeconds() !== previousDate.getSeconds();
          dateAtStartCycle = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            previousDate.getDate(),
            previousDate.getHours(),
            previousDate.getMinutes(),
            previousDate.getSeconds()
          );
          break;
      }

      const triggerOffset =
        new Date(dateAtStartCycle.getTime() + event.offset * 1000) <
        new Date(currentDate.getTime() + event.offset * 1000);

      if (trigger && triggerOffset) {
        previousDate = new Date();

        event.execute(currentDate, ...args);
      }
    } else if (event.trigger === "EVERY") {
      event.execute(new Date(), ...args);
    }
  }, intervalSeconds * 1000);
}
