import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import "./index.less";
import Taro, { getSystemInfoSync, useRouter } from "@tarojs/taro";
import classNames from "classnames";

const HandsBarrage: React.FC = () => {
  const {
    params: { data = "" },
  } = useRouter();
  const { windowWidth, windowHeight } = getSystemInfoSync();
  const { fontSize, fontColor, time, barrage, bgColor } = useMemo(() => {
    if (data) {
      return JSON.parse(decodeURIComponent(data));
    }
    return {};
  }, [data]);
  return (
    <View
      className={classNames(
        "handsBarrage",
        windowWidth > windowHeight && "noRotate"
      )}
    >
      <View
        className="scrollText"
        style={{
          fontSize,
          color: fontColor,
          background: bgColor,
          "--time": `${time}s`,
        }}
      >
        {barrage}
      </View>
    </View>
  );
};
export default HandsBarrage;
