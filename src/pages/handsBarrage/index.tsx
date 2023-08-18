import React, { useMemo, useRef } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { useDebounce } from "@/hooks/useDebounce";

const HandsBarrage: React.FC = () => {
  const {
    params: { data = "" },
  } = Taro.useRouter();
  const { windowWidth, windowHeight } = Taro.getSystemInfoSync();
  const confirmQuit = useRef(false);
  const { fontSize, fontColor, time, barrage, bgColor } = useMemo(() => {
    if (data) {
      return JSON.parse(decodeURIComponent(data));
    }
    return {};
  }, [data]);
  const exist = () => {
    if (!confirmQuit.current) {
      Taro.showToast({
        title: "再次点击可退出弹幕",
        icon: "none",
        duration: 500,
      });
      confirmQuit.current = true;
      onQuit();
      return;
    }
    Taro.navigateBack();
  };
  const onQuit = useDebounce(() => {
    confirmQuit.current = false;
  }, 500);
  return (
    <View
      onClick={exist}
      style={{
        background: bgColor,
      }}
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
          "--time": `${time}s`,
        }}
      >
        {barrage}
      </View>
    </View>
  );
};
export default HandsBarrage;
