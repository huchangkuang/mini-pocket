import React, { useEffect, useMemo, useRef, useState } from "react";
import Taro, { MovableArea, MovableView, View } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";
import {
  getMenuButtonBoundingClientRect,
  getSystemInfoSync,
  navigateBack,
} from "@tarojs/taro";
import cs from "classnames";
import { randomNum } from "@/utils/generateNum";

type Fingers = {
  id: number;
  x: number;
  y: number;
  color: string;
};
const colors = ["#cb4e18", "#2FD688", "#449de0", "#d73838", "#00FFFF"];
let clock: NodeJS.Timer | undefined;
let timer: NodeJS.Timer | undefined;
const FingerUp: React.FC = () => {
  const { windowWidth = 0 } = getSystemInfoSync();
  const transformX = (windowWidth / 375) * 50;
  const { height = 0, top = 0 } = getMenuButtonBoundingClientRect();
  const [fingers, setFingers] = useState<Fingers[]>([]);
  const [count, setCount] = useState(3);
  const isCountDown = useRef(false);
  const [selectId, setSelectId] = useState<number>();
  const disabled = useMemo(() => fingers.length < 2, [fingers.length]);
  const colorList = useRef(colors);
  const touchStart = (e: Taro.ITouchEvent) => {
    if (timer) return;
    const pickIndex = randomNum(0, colorList.current.length);
    const color =
      colorList.current.length === 1
        ? colorList.current[0]
        : colorList.current.splice(pickIndex, 1)[0];
    const newFingers = [...fingers];
    const ids = newFingers.map((i) => i.id);
    e.touches.forEach((i) => {
      if (!ids.includes(i.identifier)) {
        newFingers.push({ id: i.identifier, x: i.pageX, y: i.pageY, color });
        setFingers(newFingers);
      }
    });
  };
  const touchMove = (e: Taro.ITouchEvent) => {
    e.changedTouches.forEach((i) => {
      setFingers((l) =>
        l.map((j) =>
          j.id === i.identifier ? { ...j, x: i.pageX, y: i.pageY } : j
        )
      );
    });
  };
  const touchEnd = (e: Taro.ITouchEvent) => {
    e.changedTouches.forEach((i) => {
      setFingers((l) => l.filter((j) => j.id !== i.identifier));
    });
  };
  const start = () => {
    if (disabled) return;
    clearClock();
    const ids = fingers.map((i) => i.id);
    const indexArr: number[] = [];
    const arr = ids.map((_, n) => n);
    const times = Math.floor(10 / arr.length);
    new Array(times).fill("").forEach(() => {
      indexArr.push(...arr);
    });
    indexArr.push(randomNum(0, ids.length));
    timer = setInterval(() => {
      if (!indexArr.length) {
        clearTimer();
        return;
      }
      const item = indexArr.splice(0, 1)[0];
      setSelectId(ids[item]);
    }, 300);
  };
  const clearClock = () => {
    clearInterval(clock);
    clock = undefined;
    isCountDown.current = false;
  };
  const clearTimer = () => {
    clearInterval(timer);
    timer = undefined;
  };
  useEffect(() => {
    if (fingers.length >= 2) {
      if (timer) return;
      setCount(3);
      if (isCountDown.current) return;
      clock = setInterval(() => {
        isCountDown.current = true;
        setCount((n) => {
          const newN = n - 1;
          if (newN <= 0) {
            clearClock();
            start();
          }
          return newN;
        });
      }, 1000);
    } else {
      clearTimer();
      clearClock();
      setSelectId(undefined);
    }
  }, [fingers.length]);
  return (
    <View
      className="fingerUp"
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchMove={touchMove}
    >
      <View style={{ top }} className="goBack" onClick={() => navigateBack()}>
        <AtIcon value="chevron-left" size={height - 4} />
      </View>
      {fingers.map((i) => (
        <MovableArea className="area">
          <MovableView
            direction="all"
            x={i.x - transformX}
            y={i.y - transformX}
            className="item"
            style={{
              "--bgColor": i.color,
              opacity:
                typeof selectId === "number" && i.id !== selectId ? 0.5 : 1,
            }}
          >
            {[1, 2].map(() => (
              <View
                className={cs(
                  "bg",
                  typeof selectId === "number" && i.id !== selectId && "dark"
                )}
              />
            ))}
          </MovableView>
        </MovableArea>
      ))}
      {!fingers.length && (
        <View className="tips">
          <View>1.请每位玩家（2~5）人用一根手指按住屏幕</View>
          <View>2.等待3秒后自动开始或点击下方开始按钮</View>
          <View>
            3.继续按住屏幕直到动画结束，被选中者（赢家）将会被高亮显示
          </View>
        </View>
      )}
      <View
        catchMove
        className={cs("start", (!clock || disabled) && "disabled")}
        onClick={start}
      >
        开始{clock ? `(${count})` : ""}
      </View>
    </View>
  );
};
export default FingerUp;
