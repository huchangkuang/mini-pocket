import { IS_WECHAT } from "@/utils/constant";

export default definePageConfig({
  navigationBarTitleText: "做个决定",
  navigationBarBackgroundColor: IS_WECHAT ? "#d5f5e3" : undefined,
  navigationBarTextStyle: "black",
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
