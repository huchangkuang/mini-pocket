import React from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import "./index.scss";
import barrageIcon from "@/images/classify/barrage.svg";
import qrcode from "@/images/classify/qrcode.svg";
import decisionIcon from "@/images/classify/decision.svg";
import fingerUp from "@/images/classify/fingerUp.svg";
import { errorToast } from "@/utils/errorToast";

const Classify: React.FC = () => {
  const classifyList = [
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
    // { icon: qrcode, text: "图片压缩", path: "" },
    // { icon: lotteryIcon, text: "随机选号", path: "/pages/lottery/index" },
    // { icon: randomIcon, text: "随机数生成", path: "" },
    // { icon: randomIcon, text: "日期计算", path: "" },
    // { icon: randomIcon, text: "二维码生成", path: "" },
    // { icon: randomIcon, text: "颜色值生成", path: "" },
  ];
  const viewToPage = (url: string) => {
    if (!url) {
      errorToast("更多功能正在开发中...");
      return;
    }
    Taro.navigateTo({ url });
  };
  return (
    <View className="classify">
      <View className="classifyList">
        {classifyList.map((i, index) => (
          <View
            key={index}
            className="classifyItem"
            onClick={() => viewToPage(i.path)}
          >
            <Image className="icon" src={i.icon} mode="aspectFill" />
            <View>{i.text}</View>
          </View>
        ))}
      </View>
    </View>
  );
};
export default Classify;
