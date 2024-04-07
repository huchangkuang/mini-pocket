import { IS_WECHAT } from "@/utils/constant";

export default definePageConfig({
  navigationBarTitleText: "反方向的钟",
  navigationBarBackgroundColor: IS_WECHAT ? "#333333" : undefined,
  navigationBarTextStyle: "white",
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
