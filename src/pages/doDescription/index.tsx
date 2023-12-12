import React, { useMemo, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";
import Triangle from "@/components/triangle";
import Taro, { getStorageSync, navigateTo, useDidShow } from "@tarojs/taro";
import {
  decisionConfig,
  DecisionItem,
  USE_LIST,
} from "@/pages/doDescription/store";

const DoDecision: React.FC = () => {
  const [itemList, setItemList] = useState(decisionConfig.list);
  const [title, setTitle] = useState(decisionConfig.title);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [useList, setUseList] = useState<
    (typeof decisionConfig & { id: string })[]
  >(getStorageSync(USE_LIST) || []);
  const [selectId, setSelectId] = useState<string>();
  const conicGradientStyle = useMemo(() => {
    const deg = Math.trunc((1 / itemList.length) * 360) / 2;
    let style = "";
    itemList.forEach((i, index) => {
      let color = index % 2 ? "#eee" : "#f9f9f9";
      const start = deg - 2 * deg + index * 2 * deg;
      const end = start + 2 * deg;
      if (style) {
        style += ", ";
      }
      if (index === itemList.length - 1 && itemList.length % 2 === 1) {
        color = "#ccc";
      }
      style += `${color} ${index ? start : 0}deg, ${color} ${end}deg`;
      if (index === itemList.length - 1) {
        style += `, #f9f9f9 ${end}deg, #f9f9f9 ${360}deg`;
      }
    });
    return style;
  }, [itemList.length]);
  const decide = () => {
    const base = 1080;
    const add = 360 * Math.random();
    const end = rotateDeg + base + add;
    setRotateDeg(end);
  };
  const selectCurItem = (item: DecisionItem) => {
    setSelectId(item.id);
    setTitle(item.title);
    setItemList(item.list);
    decisionConfig.id = item.id;
    decisionConfig.title = item.title;
    decisionConfig.list = item.list;
  };
  useDidShow(() => {
    setTitle(decisionConfig.title);
    setItemList(decisionConfig.list);
    setRotateDeg(0);
    setUseList(getStorageSync(USE_LIST) || []);
  });
  return (
    <View className="doDescription">
      <View className="project">
        <View style={{ width: "28px" }} />
        <View className="projectTitle">{title}</View>
        <AtIcon
          onClick={() =>
            navigateTo({
              url: `/pages/doDescription/edit/index${
                selectId ? `?id=${selectId}&type=edit` : "?type=edit"
              }`,
            })
          }
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
          {itemList.map((i, index) => (
            <View
              className="selectItem"
              style={{
                transform: `translate(-50%, -50%) rotate(${Math.trunc(
                  (1 / itemList.length) * 360 * index
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
      {useList.length > 1 && (
        <View className="usuallyUse">
          <View className="usuallyUseTitle">
            <View>最近常用</View>
            <AtIcon
              onClick={() =>
                navigateTo({ url: "/pages/doDescription/edit/index?type=add" })
              }
              value="add"
              size={20}
              color="#333"
            />
          </View>
          <ScrollView scrollY className="useListWrap">
            {useList.map((i) => (
              <View
                onClick={() => selectCurItem(i)}
                className="decisionItem"
                key={i.id}
              >
                <View className="decisionItem-left">
                  <View className="decisionItem-title">{i.title}</View>
                  <View className="decisionItem-list">{i.list.join(",")}</View>
                </View>
                {i.id === selectId && (
                  <AtIcon value="check" color="#cb4e18" size={14} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default DoDecision;
