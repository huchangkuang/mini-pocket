import React from "react";
import { Text, View } from "@tarojs/components";
import "./index.scss";

const About: React.FC = () => {
  return (
    <View className="aboutPage">
      <View className="aboutPage__card">
        <Text className="aboutPage__title">百宝口袋工坊</Text>
        <Text className="aboutPage__desc">更多内容即将上线</Text>
      </View>
    </View>
  );
};

export default About;
