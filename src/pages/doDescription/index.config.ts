import { IS_WECHAT } from "@/utils/constant";

export default definePageConfig({
  navigationBarTitleText: "做个决定",
  navigationBarBackgroundColor: IS_WECHAT ? "#88d8b0" : undefined,
  navigationBarTextStyle: "white",
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
