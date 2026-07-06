import React, { FC, memo } from "react";
import { Button, Image, View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import emptyHeart from "@/images/favorites/empty-heart.svg";
import "./index.scss";

export type FavoritesEmptyProps = {
  variant?: "empty" | "guest";
  loading?: boolean;
  onLogin?: () => void;
};

const FavoritesEmpty: FC<FavoritesEmptyProps> = memo(
  ({ variant = "empty", loading, onLogin }) => {
    const goDiscover = () => {
      Taro.switchTab({ url: "/pages/classify/index" });
    };

    const isGuest = variant === "guest";

    return (
      <View className="favoritesEmpty">
        <Image
          className="favoritesEmpty__illustration"
          src={emptyHeart}
          mode="aspectFit"
        />
        <Text className="favoritesEmpty__title">
          {isGuest ? "登录后查看收藏" : "还没有收藏的工具"}
        </Text>
        <Text className="favoritesEmpty__desc">
          {isGuest
            ? "登录百宝口袋工坊，同步您的工具收藏"
            : "去工作坊逛逛，发现让你心动的百宝工具吧！"}
        </Text>
        <Button
          className="favoritesEmpty__cta"
          loading={loading}
          disabled={loading}
          onClick={isGuest ? onLogin : goDiscover}
        >
          <Text className="favoritesEmpty__ctaText">
            {isGuest ? "立即登录" : "去发现"}
          </Text>
        </Button>
      </View>
    );
  }
);

export default FavoritesEmpty;
