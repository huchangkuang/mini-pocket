import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { Image, View, Button, Input } from "@tarojs/components";
import "./index.scss";
import barrageIcon from "@/images/classify/barrage.svg";
import lotteryIcon from "@/images/classify/lottery.svg";
import randomIcon from "@/images/classify/random.svg";
import decisionIcon from "@/images/classify/decision.svg";
import { errorToast } from "@/utils/errorToast";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";

const Classify: React.FC = () => {
  const [barrage, setBarrage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const classifyList = [
    { icon: lotteryIcon, text: "双色球单式", path: "/pages/lottery/index" },
    {
      icon: barrageIcon,
      text: "手持弹幕",
      path: `/pages/handsBarrage/index?text=${barrage}`,
      action: () => setShowModal(true),
    },
    { icon: decisionIcon, text: "做个决定吧", path: "" },
    { icon: randomIcon, text: "随机数生成", path: "" },
    { icon: randomIcon, text: "日期计算", path: "" },
    { icon: randomIcon, text: "图片压缩", path: "" },
    { icon: randomIcon, text: "二维码生成", path: "" },
    { icon: randomIcon, text: "颜色值生成", path: "" },
  ];
  const viewToPage = (url: string) => {
    if (!url) {
      errorToast("更多功能正在开发中...");
      return;
    }
    Taro.navigateTo({ url });
  };
  const confirm = () => {
    if (barrage.length > 20) {
      errorToast("弹幕字数限制20字");
      return;
    }
    Taro.navigateTo({ url: `/pages/handsBarrage/index?text=${barrage}` });
  };
  return (
    <View className="classify">
      <View className="classifyList">
        {classifyList.map((i, index) => (
          <View
            key={index}
            className="classifyItem"
            onClick={() => (i.action ? i.action() : viewToPage(i.path))}
          >
            <Image className="icon" src={i.icon} mode="aspectFill" />
            <View>{i.text}</View>
          </View>
        ))}
      </View>
      <AtModal isOpened={showModal} onClose={() => setShowModal(false)}>
        <AtModalHeader>请输入弹幕内容</AtModalHeader>
        <AtModalContent>
          <Input
            placeholder="弹幕字数限制20字"
            maxlength={20}
            value={barrage}
            onInput={(e) => setBarrage(e.detail.value)}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowModal(false)}>取消</Button>
          <Button onClick={confirm}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};
export default Classify;
