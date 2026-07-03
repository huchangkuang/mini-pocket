import barrageIcon from "@/images/classify/barrage.svg";
import decisionIcon from "@/images/classify/decision.svg";
import fingerUp from "@/images/classify/fingerUp.svg";
import qrcode from "@/images/classify/qrcode.svg";
import metronome from "@/images/classify/metronome.svg";
import lottery from "@/images/classify/lottery.svg";
import clock from "@/images/classify/clock.svg";
// import beadArtIcon from "@/images/classify/beadArt.svg";
import randomIcon from "@/images/classify/random.svg";

export type Accent = "primary" | "secondary" | "tertiary";

export type ToolItem = {
  icon: string;
  text: string;
  desc: string;
  path: string;
  accent: Accent;
  category?: string;
};

export type CategoryChip = {
  id: string;
  label: string;
};

export const categoryChips: CategoryChip[] = [
  { id: "all", label: "全部" },
  { id: "life", label: "生活" },
  { id: "fun", label: "娱乐" },
  { id: "efficiency", label: "效率" },
  { id: "dev", label: "开发" },
];

export const classifyList: ToolItem[] = [
  {
    icon: barrageIcon,
    text: "手持弹幕",
    desc: "应援与表达神器",
    path: "/pages/handsBarrage/edit/index",
    accent: "primary",
    category: "fun",
  },
  {
    icon: decisionIcon,
    text: "做个决定吧",
    desc: "告别选择困难",
    path: "/pages/doDescription/index",
    accent: "secondary",
    category: "fun",
  },
  {
    icon: fingerUp,
    text: "指尖轮盘",
    desc: "指尖上的运气",
    path: "/pages/fingerUp/index",
    accent: "tertiary",
    category: "fun",
  },
  {
    icon: qrcode,
    text: "二维码生成",
    desc: "快速转换链接",
    path: "/pages/qrcode/index",
    accent: "primary",
    category: "efficiency",
  },
  {
    icon: metronome,
    text: "节拍器",
    desc: "精准节奏控制",
    path: "/pages/metronome/index",
    accent: "secondary",
    category: "life",
  },
  {
    icon: lottery,
    text: "随机数",
    desc: "幸运数字生成",
    path: "/pages/lottery/index",
    accent: "tertiary",
    category: "fun",
  },
  {
    icon: clock,
    text: "反方向的钟",
    desc: "让时间“倒流”",
    path: "/pages/returnClock/index",
    accent: "primary",
    category: "life",
  },
  // {
  //   icon: beadArtIcon,
  //   text: "拼豆图片生成",
  //   desc: "像素化艺术创作",
  //   path: "/pages/beadArt/index",
  //   accent: "secondary",
  //   category: "efficiency",
  // },
  {
    icon: randomIcon,
    text: "猜数字",
    desc: "聚会小游戏",
    path: "/pages/guessNumber/index",
    accent: "tertiary",
    category: "fun",
  },
];

export const excludeClassifyList = ["/pages/lottery/index"];
