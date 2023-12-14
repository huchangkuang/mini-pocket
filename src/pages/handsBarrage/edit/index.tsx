import React, { useState } from "react";
import { View, Input, Picker, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { AtSlider, AtIcon, AtModal, AtButton } from "taro-ui";
import { errorToast } from "@/utils/errorToast";
import {
  BarrageType,
  barrageTypeMap,
  BarrageTypeRange,
} from "@/pages/handsBarrage/constants";
import cs from "classnames";

const colorList = [
  "#fff",
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#8b00ff",
  "#000",
];

const EditBarrage: React.FC = () => {
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState("#fff");
  const [bgColor, setBgColor] = useState("#000");
  const [time, setTime] = useState(5);
  const [barrage, setBarrage] = useState("");
  const [barrageType, setBarrageType] = useState<BarrageType>(
    BarrageType.scroll
  );
  const [showColorModal, setShowColorModal] = useState<"font" | "bg">();
  const [expandCustom, setExpandCustom] = useState(false);
  const onColorChange = (value: string) => {
    if (showColorModal === "font") {
      setFontColor(value);
    } else {
      setBgColor(value);
    }
    setShowColorModal(undefined);
  };
  const validateBarrage = () => {
    if (!barrage) {
      return "请输入弹幕内容";
    }
    if (barrage.length > 20) {
      return "弹幕字数限制20字";
    }
  };
  const confirm = () => {
    const msg = validateBarrage();
    if (msg) {
      errorToast(msg);
      return;
    }
    const data = { fontSize, fontColor, time, barrage, bgColor, barrageType };
    Taro.navigateTo({
      url: `/pages/handsBarrage/index?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`,
    });
  };
  return (
    <View className="editBarrage">
      <View className="mainFormContent">
        <View className="title">弹幕内容</View>
        <Input
          className="barrageInput"
          placeholder="弹幕字数限制20字"
          maxlength={20}
          value={barrage}
          onInput={(e) => setBarrage(e.detail.value)}
          name="barrage"
        />
        <View className="title">弹幕形式</View>
        <Picker
          value={barrageType}
          range={BarrageTypeRange}
          onChange={(e) => setBarrageType(Number(e.detail.value))}
        >
          <View className="barrageType">
            <View>{barrageTypeMap[barrageType]}</View>
            <AtIcon value="chevron-right" size={16} color="#333" />
          </View>
        </Picker>
      </View>
      <AtButton className="confirm" type="primary" onClick={confirm}>
        确认
      </AtButton>
      <View
        className="customStr"
        onClick={() => setExpandCustom(!expandCustom)}
      >
        <Text>自定义</Text>
        <AtIcon
          className={cs("arrow", expandCustom && "expand")}
          value="chevron-down"
          size={16}
          color="#999"
        />
      </View>
      <View className={cs("customContent", expandCustom && "expand")}>
        <View className="title" onClick={() => setShowColorModal("font")}>
          <View>字体颜色: </View>
          <View className="colorShow" style={{ background: fontColor }} />
          <AtIcon value="edit" size="16" color="#333" />
        </View>
        <View className="title" onClick={() => setShowColorModal("bg")}>
          <View>背景颜色: </View>
          <View className="colorShow" style={{ background: bgColor }} />
          <AtIcon value="edit" size="16" color="#333" />
        </View>
        <View className="title">字体大小: {fontSize}px</View>
        <AtSlider
          min={40}
          max={120}
          value={fontSize}
          onChanging={(value) => setFontSize(value)}
        />
        <View className="title">弹幕时间: {time}秒</View>
        <AtSlider
          min={1}
          max={10}
          value={time}
          onChanging={(value) => setTime(value)}
        />
      </View>
      <AtModal
        isOpened={!!showColorModal}
        onClose={() => setShowColorModal(undefined)}
      >
        <View className="colorList">
          {colorList.map((i) => (
            <View
              onClick={() => onColorChange(i)}
              className="colorItem"
              style={{ background: i }}
            />
          ))}
        </View>
      </AtModal>
    </View>
  );
};
export default EditBarrage;
