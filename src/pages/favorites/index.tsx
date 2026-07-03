import React from "react";
import { View, Text } from "@tarojs/components";
import HomeTopBar from "@/components/homeTopBar";
import BottomNav from "@/components/bottomNav";
import "./index.scss";

const Favorites: React.FC = () => {
  return (
    <View className="tabPage">
      <HomeTopBar showActions={false} />
      <View className="tabPage__body">
        <View className="emptyState">
          <Text className="emptyState__title">收藏功能开发中</Text>
          <Text className="emptyState__desc">
            敬请期待，稍后在这里查看常用工具
          </Text>
        </View>
      </View>
      <BottomNav active="favorites" />
    </View>
  );
};

export default Favorites;
