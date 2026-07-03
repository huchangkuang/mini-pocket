import React, { FC, memo } from "react";
import { Image, View, Text } from "@tarojs/components";
import cs from "classnames";
import type { Accent } from "@/pages/classify/constants";
import "./index.scss";

export type ToolCardProps = {
  icon: string;
  title: string;
  desc: string;
  accent: Accent;
  onClick: () => void;
};

const ToolCard: FC<ToolCardProps> = memo(
  ({ icon, title, desc, accent, onClick }) => {
    return (
      <View className="toolCard" onClick={onClick}>
        <View
          className={cs("toolCard__iconWrap", `toolCard__iconWrap--${accent}`)}
        >
          <Image className="toolCard__icon" src={icon} mode="aspectFit" />
        </View>
        <View className="toolCard__text">
          <Text className="toolCard__title">{title}</Text>
          <Text className="toolCard__desc">{desc}</Text>
        </View>
      </View>
    );
  }
);

export default ToolCard;
