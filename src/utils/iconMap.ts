import barrageIcon from "@/images/classify/barrage.svg";
import decisionIcon from "@/images/classify/decision.svg";
import fingerUp from "@/images/classify/fingerUp.svg";
import qrcode from "@/images/classify/qrcode.svg";
import metronome from "@/images/classify/metronome.svg";
import lottery from "@/images/classify/lottery.svg";
import clock from "@/images/classify/clock.svg";
import randomIcon from "@/images/classify/random.svg";

const ICON_MAP: Record<string, string> = {
  barrage: barrageIcon,
  decision: decisionIcon,
  fingerUp,
  qrcode,
  metronome,
  lottery,
  clock,
  random: randomIcon,
};

const DEFAULT_ICON = randomIcon;

export function resolveIconKey(iconKey: string): string {
  return ICON_MAP[iconKey] ?? DEFAULT_ICON;
}
