import { Context, h } from "koishi";
import { Config } from "./config";
import {} from "@koishijs/plugin-http";
import {} from "koishi-plugin-cron";
import { assetsInit, getNewsImg } from "./assetsUtil";

declare module "koishi" {
  interface Events {
    "dailynews/trigger"(): void;
  }
}

export function apply(ctx: Context, config: Config) {
  assetsInit(ctx, config);

  const cronExpression = `${formatCronField(config.min)} ${formatCronField(
    config.hour
  )} ${formatCronField(config.dayOfMonth)} * ${formatCronField(
    config.weekDay
  )}`;

  ctx
    .command("dailynews", "手动触发 dailynews 发送资讯")
    .action(buildImageMessage);

  try {
    ctx.cron(cronExpression, async () => {
      ctx.emit("dailynews/trigger");
    });
  } catch (error) {
    ctx.logger.error(error);
  }

  ctx.on("dailynews/trigger", handleMorningEvent);

  async function buildImageMessage() {
    const imageUrl = await getNewsImg();
    if (!imageUrl) return;
    return h("img", { src: imageUrl });
  }

  async function handleMorningEvent() {
    const message = await buildImageMessage();
    if (!message) return;
    if (config.broad) {
      await ctx.broadcast(message);
    } else {
      for (const target of config.broadArray || []) {
        ctx.bots[`${target.adapter}:${target.botId}`].sendMessage(
          `${target.groupId}`,
          message
        );
        ctx.sleep(2000);
      }
    }
  }
}

function formatCronField(value: number): string {
  return value === -1 ? "*" : (value ?? -1).toString();
}

export * from "./config";
