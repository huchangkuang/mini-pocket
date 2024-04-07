import React, { useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import cs from "classnames";
import dayjs from "dayjs";

const ReturnClock: React.FC = () => {
  const [hour, setHour] = useState(dayjs().hour());
  const [minute, setMinute] = useState(dayjs().minute());
  const [second, setSecond] = useState(dayjs().second());
  const time = useRef(dayjs().valueOf());
  const updateTime = () => {
    setHour(dayjs(time.current).hour());
    setMinute(dayjs(time.current).minute());
    setSecond(dayjs(time.current).second());
  };
  useEffect(() => {
    const clock = setInterval(() => {
      time.current -= 1000;
      updateTime();
    }, 1000);
    return () => {
      clearInterval(clock);
    };
  }, []);
  return (
    <View className="returnClock">
      <View className="face">
        <View className="numbers">
          {new Array(12).fill("").map((i, n) => (
            <View className={cs("number", `number-${n + 1}`)}>
              <View>{n + 1}</View>
            </View>
          ))}
        </View>
        <View className="arms">
          <View
            className={cs("arm", "arm-hour")}
            style={{
              transform: `translate(-50%, -100%) rotate(${
                hour * 30 + (minute / 60) * 30
              }deg)`,
            }}
          ></View>
          <View
            className={cs("arm", "arm-minute")}
            style={{
              transform: `translate(-50%, -100%) rotate(${minute * 6}deg)`,
            }}
          ></View>
          <View
            className={cs("arm", "arm-second")}
            style={{
              transform: `translate(-50%, -100%) rotate(${second * 6}deg)`,
            }}
          >
            <View className="body"></View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ReturnClock;
