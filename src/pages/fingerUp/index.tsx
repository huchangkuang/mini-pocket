import React, { useEffect, useMemo, useRef, useState } from "react";
import Taro, {
  CustomWrapper,
  MovableArea,
  MovableView,
  View,
} from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";
import {
  getMenuButtonBoundingClientRect,
  getSystemInfoSync,
  navigateBack,
  useShareAppMessage,
} from "@tarojs/taro";
import cs from "classnames";
import { randomNum } from "@/utils/generateNum";
import { IS_WECHAT } from "@/utils/constant";

type Fingers = {
  id: number;
  x: number;
  y: number;
  color: string;
};
const colors = ["#cb4e18", "#2FD688", "#449de0", "#d73838", "#00FFFF"];
const FingerUp: React.FC = () => {
  const { windowWidth = 0 } = getSystemInfoSync();
  const transformX = (windowWidth / 375) * 50;
  const { height = 0, top = 0 } = getMenuButtonBoundingClientRect();
  const clock = useRef<NodeJS.Timer>();
  const timer = useRef<NodeJS.Timer>();
  const [fingers, setFingers] = useState<Fingers[]>([]);
  const [count, setCount] = useState(3);
  const [selectId, setSelectId] = useState<number>();
  const disabled = useMemo(() => fingers.length < 2, [fingers.length]);
  const touchStart = (e: Taro.ITouchEvent) => {
    if (timer.current) return;
    const pickIndex = fingers.length % colors.length;
    const color = colors[pickIndex];
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
    if (!e.touches.length) {
      setFingers([]);
      return;
    }
    const existIds = e.touches.map((i) => i.identifier);
    setTimeout(() => {
      setFingers((l) => l.filter((j) => existIds.includes(j.id)));
    }, 100);
  };
  const generateRandomArr = () => {
    const ids = fingers.map((i) => i.id);
    const idArr: number[] = [];
    const times = Math.ceil(10 / ids.length);
    for (let i = 0; i < times; i++) {
      idArr.push(...ids);
    }
    const selectedIndex = randomNum(0, ids.length);
    idArr.push(ids[selectedIndex]);
    return idArr;
  };
  const start = (e?: Taro.ITouchEvent) => {
    e?.stopPropagation();
    if (disabled) return;
    clearClock();
    const idArr = generateRandomArr();
    timer.current = setInterval(() => {
      if (!idArr.length) {
        clearTimer();
        return;
      }
      const id = idArr.shift();
      setSelectId(id);
    }, 400);
  };
  const clearClock = () => {
    clearInterval(clock.current);
    clock.current = undefined;
  };
  const clearTimer = () => {
    clearInterval(timer.current);
    timer.current = undefined;
  };
  const startCountDown = () => {
    clock.current = setInterval(() => {
      setCount((n) => {
        const newN = n - 1;
        if (newN <= 0) {
          clearClock();
          start();
        }
        return newN;
      });
    }, 1000);
  };
  const resetAction = () => {
    clearTimer();
    clearClock();
    setSelectId(undefined);
  };
  const onNewFingerAdd = () => {
    clearClock();
    setCount(3);
    startCountDown();
  };
  useEffect(() => {
    if (fingers.length >= 2) {
      if (timer.current) return;
      onNewFingerAdd();
    } else {
      resetAction();
    }
  }, [fingers.length]);
  useShareAppMessage(() => {
    return {
      title: "指尖轮盘",
      path: "/pages/fingerUp/index",
    };
  });
  return (
    <View
      className="fingerUp"
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchMove={touchMove}
    >
      {IS_WECHAT && (
        <View style={{ top }} className="goBack" onClick={() => navigateBack()}>
          <AtIcon value="chevron-left" size={height - 4} />
        </View>
      )}
      <CustomWrapper>
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
      </CustomWrapper>
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
        className={cs("start", (!clock.current || disabled) && "disabled")}
        onClick={start}
      >
        开始{clock.current ? `(${count})` : ""}
      </View>
    </View>
  );
};
export default FingerUp;
