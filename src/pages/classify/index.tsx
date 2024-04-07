import React from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import "./index.scss";
import { errorToast } from "@/utils/errorToast";
import { classifyList, excludeClassifyList } from "@/pages/classify/constants";

const Classify: React.FC = () => {
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
        {classifyList
          .filter((i) => !excludeClassifyList.includes(i.path))
          .map((i, index) => (
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
