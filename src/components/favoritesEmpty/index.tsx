import React, { FC, memo } from "react";
import { Image, View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import emptyHeart from "@/images/favorites/empty-heart.svg";
import "./index.scss";

const FavoritesEmpty: FC = memo(() => {
  const goDiscover = () => {
    Taro.switchTab({ url: "/pages/classify/index" });
  };

  return (
    <View className="favoritesEmpty">
      <Image
        className="favoritesEmpty__illustration"
        src={emptyHeart}
        mode="aspectFit"
      />
      <Text className="favoritesEmpty__title">还没有收藏的工具</Text>
      <Text className="favoritesEmpty__desc">
        去工作坊逛逛，发现让你心动的百宝工具吧！
      </Text>
      <View className="favoritesEmpty__cta" onClick={goDiscover}>
        <Text className="favoritesEmpty__ctaText">去发现</Text>
      </View>
    </View>
  );
});

export default FavoritesEmpty;
