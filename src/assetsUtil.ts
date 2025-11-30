import { Context, HTTP, Logger } from "koishi";
import { Config } from "./config";

const DEFAULT_NEWS_API_URL = "https://60api.09cdn.xyz/v2/60s";

let currentConfig: Config;
let httpClient: HTTP;
let logger: Logger;

export function initializeAssets(ctx: Context, config: Config) {
  currentConfig = config;
  httpClient = ctx.http;
  logger = ctx.logger("dailynewsUtil");
  logger.level = currentConfig.debugModel ? Logger.DEBUG : Logger.INFO;
}

export async function fetchNewsImageUrl(): Promise<string> {
  const url = currentConfig?.apiUrl || DEFAULT_NEWS_API_URL;
  try {
    const response: any = await httpClient.get(url, { responseType: "json" });
    logger.debug("fetchNewsImageUrl response:", response);

    const data = response && (response.data || response);
    if (!data) return "";
    const payload = data.data || data;
    if (!payload) return "";

    const imageUrl = payload.image;
    return typeof imageUrl === "string" ? imageUrl : "";
  } catch (error) {
    logger.error(error);
    return "";
  }
}

export { initializeAssets as assetsInit, fetchNewsImageUrl as getNewsImg };
