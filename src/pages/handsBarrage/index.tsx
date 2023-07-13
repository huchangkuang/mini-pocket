import React from "react";
import { View } from "@tarojs/components";
import "./index.less";
import Taro, { useRouter } from "@tarojs/taro";

const HandsBarrage: React.FC = () => {
  const {
    params: { text },
  } = useRouter();
  return (
    <View className="handsBarrage">
      <View className="scrollText">{text}</View>
    </View>
  );
};
export default HandsBarrage;
