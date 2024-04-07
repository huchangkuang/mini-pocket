import barrageIcon from "@/images/classify/barrage.svg";
import decisionIcon from "@/images/classify/decision.svg";
import fingerUp from "@/images/classify/fingerUp.svg";
import qrcode from "@/images/classify/qrcode.svg";
import metronome from "@/images/classify/metronome.svg";
import lottery from "@/images/classify/lottery.svg";
import clock from "@/images/classify/clock.svg";

export const classifyList = [
  {
    icon: barrageIcon,
    text: "手持弹幕",
    path: "/pages/handsBarrage/edit/index",
  },
  {
    icon: decisionIcon,
    text: "做个决定吧",
    path: "/pages/doDescription/index",
  },
  { icon: fingerUp, text: "指尖轮盘", path: "/pages/fingerUp/index" },
  { icon: qrcode, text: "二维码生成", path: "/pages/qrcode/index" },
  { icon: metronome, text: "节拍器", path: "/pages/metronome/index" },
  { icon: lottery, text: "随机数", path: "/pages/lottery/index" },
  { icon: clock, text: "反方向的钟", path: "/pages/returnClock/index" },
  // { icon: qrcode, text: "图片压缩", path: "" },
  // { icon: lotteryIcon, text: "随机选号", path: "/pages/lottery/index" },
  // { icon: randomIcon, text: "随机数生成", path: "" },
  // { icon: randomIcon, text: "日期计算", path: "" },
  // { icon: randomIcon, text: "二维码生成", path: "" },
  // { icon: randomIcon, text: "颜色值生成", path: "" },
];
export const excludeClassifyList = ["/pages/lottery/index"];
