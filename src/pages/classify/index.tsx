import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import HomeTopBar from "@/components/homeTopBar";
import FeaturedBanner from "@/components/featuredBanner";
import ToolCard from "@/components/toolCard";
import CategoryChips from "@/components/categoryChips";
import { errorToast } from "@/utils/errorToast";
import { useTabBarSelected } from "@/utils/useTabBarSelected";
import {
  classifyList,
  categoryChips,
  excludeClassifyList,
} from "@/pages/classify/constants";
import "./index.scss";

const PLACEHOLDER_MSG = "更多功能正在开发中...";

const Classify: React.FC = () => {
  useTabBarSelected("workshop");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const viewToPage = (url: string) => {
    if (!url) {
      errorToast(PLACEHOLDER_MSG);
      return;
    }
    Taro.navigateTo({ url });
  };

  const visibleTools = classifyList.filter(
    (item) => !excludeClassifyList.includes(item.path)
  );

  return (
    <View className="workshop">
      <HomeTopBar
        onSearch={() => errorToast(PLACEHOLDER_MSG)}
        onTerminal={() => errorToast(PLACEHOLDER_MSG)}
      />

      <ScrollView scrollY className="workshop__scroll">
        <View className="workshop__content">
          <FeaturedBanner />

          <View className="workshop__section">
            <View className="workshop__sectionHeader">
              <Text className="workshop__sectionTitle">全部工具</Text>
              <Text
                className="workshop__manage"
                onClick={() => errorToast(PLACEHOLDER_MSG)}
              >
                管理
              </Text>
            </View>

            <View className="workshop__grid">
              {visibleTools.map((item) => (
                <ToolCard
                  key={item.path}
                  icon={item.icon}
                  title={item.text}
                  desc={item.desc}
                  accent={item.accent}
                  onClick={() => viewToPage(item.path)}
                />
              ))}
            </View>
          </View>

          <CategoryChips
            chips={categoryChips}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>
      </ScrollView>

      <View
        className="workshop__fab"
        onClick={() => errorToast(PLACEHOLDER_MSG)}
      >
        <AtIcon value="add" size="28" color="#ffffff" />
      </View>
    </View>
  );
};

export default Classify;
