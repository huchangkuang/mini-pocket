import { IS_WECHAT } from "@/utils/constant";

export default definePageConfig({
  navigationBarTitleText: "反方向的钟",
  navigationBarBackgroundColor: IS_WECHAT ? "#f9f9f9" : undefined,
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
