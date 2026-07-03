import React, { FC, memo } from "react";
import { Image, View, Text } from "@tarojs/components";
import { getMenuButtonBoundingClientRect } from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import logo from "@/images/logo.svg";
import "./index.scss";

export type HomeTopBarProps = {
  showActions?: boolean;
  onSearch?: () => void;
  onTerminal?: () => void;
};

const HomeTopBar: FC<HomeTopBarProps> = memo(
  ({ showActions = true, onSearch, onTerminal }) => {
    const { height, top } = getMenuButtonBoundingClientRect();
    const barHeight = top + height + 5;

    return (
      <>
        <View className="homeTopBar" style={{ height: `${barHeight}px` }}>
          <View
            className="homeTopBar__inner"
            style={{ height: `${height}px`, top: `${top}px` }}
          >
            <View className="homeTopBar__brand">
              <Image className="homeTopBar__logo" src={logo} mode="aspectFit" />
              <Text className="homeTopBar__title">百宝口袋工坊</Text>
            </View>
            {showActions && (
              <View className="homeTopBar__actions">
                <View className="homeTopBar__action" onClick={onSearch}>
                  <AtIcon value="search" size="20" color="#404752" />
                </View>
                <View className="homeTopBar__action" onClick={onTerminal}>
                  <Text className="homeTopBar__terminal">&gt;_</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{ height: `${barHeight}px` }} />
      </>
    );
  }
);

export default HomeTopBar;
