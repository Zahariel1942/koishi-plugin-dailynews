import { Schema } from "koishi";

export const name = "dailynews";

export const inject = {
  required: ["cron", "database"],
  optional: []
};

export interface Config {
  min?: number;
  hour?: number;
  dayOfMonth?: number;
  weekDay?: number;
  apiUrl?: string;
  broad?: boolean;
  broadArray?: Array<{ adapter: string; botId: string; groupId: string }>;
  debugModel?: boolean;
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    apiUrl: Schema.string()
      .default("https://60s.viki.moe/v2/60s")
      .description("60s API 地址,参考: https://docs.60s-api.viki.moe/")
  }).description("API接口"),
  Schema.object({
    min: Schema.number()
      .default(50)
      .max(59)
      .min(-1)
      .description("每小时的第几分钟(0-59)"),
    hour: Schema.number()
      .default(7)
      .max(23)
      .min(-1)
      .description("每天的第几小时(0-23)"),
    dayOfMonth: Schema.number()
      .default(-1)
      .max(31)
      .min(-1)
      .description("每个月的第几天(0-31)"),
    weekDay: Schema.number().default(-1).max(7).min(-1).description("周几(1-7)")
  }).description("定时设置"),

  Schema.object({
    broad: Schema.boolean()
      .default(true)
      .description("在所有群聊广播,关闭后可指定群配置")
  }).description("广播设置"),
  Schema.union([
    Schema.object({
      broad: Schema.const(false).required(),
      broadArray: Schema.array(
        Schema.object({
          adapter: Schema.string().default("onebot").description("适配器名"),
          botId: Schema.string().default("552487878").description("机器人账号"),
          groupId: Schema.string().default("1145141919").description("群组号")
        })
      ).role("table")
    }),
    Schema.object({})
  ]),
  Schema.object({
    debugModel: Schema.boolean()
      .default(false)
      .description("开启后会输出详细日志")
  }).description("调试模式")
]);
