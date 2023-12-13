export enum BarrageType {
  scroll,
  bounce,
  static,
}
export type BarrageTypeStr = "滚动弹幕" | "抖动文字" | "打字版";

export const barrageTypeMap: Record<BarrageType, BarrageTypeStr> = {
  [BarrageType.scroll]: "滚动弹幕",
  [BarrageType.bounce]: "抖动文字",
  [BarrageType.static]: "打字版",
};

export const BarrageTypeRange: BarrageTypeStr[] = [
  "滚动弹幕",
  "抖动文字",
  "打字版",
];

export const classMap = {
  [BarrageType.scroll]: "scroll",
  [BarrageType.bounce]: "bounce",
  [BarrageType.static]: "static",
};
