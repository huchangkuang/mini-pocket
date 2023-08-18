import React, { useMemo, useState } from "react";
import Taro, { View } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";
import Triangle from "@/components/triangle";
import { navigateTo, useDidShow } from "@tarojs/taro";
import { decisionConfig } from "@/pages/doDescription/store";

const DoDecision: React.FC = () => {
  const [list, setList] = useState(decisionConfig.list);
  const [title, setTitle] = useState(decisionConfig.title);
  const [rotateDeg, setRotateDeg] = useState(0);
  const conicGradientStyle = useMemo(() => {
    const deg = Math.trunc((1 / list.length) * 360) / 2;
    let style = "";
    list.forEach((i, index) => {
      let color = index % 2 ? "#eee" : "#f9f9f9";
      const start = deg - 2 * deg + index * 2 * deg;
      const end = start + 2 * deg;
      if (style) {
        style += ", ";
      }
      if (index === list.length - 1 && list.length % 2 === 1) {
        color = "#ccc";
      }
      style += `${color} ${index ? start : 0}deg, ${color} ${end}deg`;
      if (index === list.length - 1) {
        style += `, #f9f9f9 ${end}deg, #f9f9f9 ${360}deg`;
      }
    });
    return style;
  }, [list.length]);
  const decide = () => {
    const base = 1080;
    const add = 360 * Math.random();
    const end = rotateDeg + base + add;
    setRotateDeg(end);
  };
  useDidShow(() => {
    setTitle(decisionConfig.title);
    setList(decisionConfig.list);
    setRotateDeg(0);
  });
  return (
    <View className="doDescription">
      <View className="project">
        <View style={{ width: "28px" }} />
        <View className="projectTitle">{title}</View>
        <AtIcon
          onClick={() => navigateTo({ url: "/pages/doDescription/edit/index" })}
          className="editIcon"
          value="edit"
          size="20"
          color="#333"
        />
      </View>
      <View className="circleBox" onClick={decide}>
        <View
          className="circle"
          style={{
            background: `conic-gradient(${conicGradientStyle})`,
            transform: `rotate(${rotateDeg}deg)`,
            transition: !rotateDeg ? "none" : undefined,
          }}
        >
          {list.map((i, index) => (
            <View
              className="selectItem"
              style={{
                transform: `translate(-50%, -50%) rotate(${Math.trunc(
                  (1 / list.length) * 360 * index
                )}deg)`,
              }}
            >
              {i}
            </View>
          ))}
        </View>
        <Triangle direction="up" className="upArrow" size={10} />
        <View className="cursor">
          <View className="second">
            <View className="third" />
          </View>
        </View>
      </View>
    </View>
  );
};
export default DoDecision;
