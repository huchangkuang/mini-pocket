import React, {FC, useState} from 'react';
import Taro from '@tarojs/taro';
import {View, Text, Switch} from "@tarojs/components";
import './index.less';
import {errorToast} from "@/utils/errorToast";
import {generateNumList} from "@/utils/generateNum";


type RedBall = (number | string)[];
type BlueBall = number | string;
type NumWrapperProps = {
  redBall?: RedBall;
  blueBall?: BlueBall;
}
const initialNum: {
  red: RedBall;
  blue: BlueBall;
} = {
  red: ["", "", "", "", "", ""],
  blue: ""
};
const NumWrapper: FC<NumWrapperProps> = ({redBall = [], blueBall = ""}) => {
  const copy = () => {
    if (!blueBall || redBall.some(i => !i)) {
      errorToast("请先选号");
      return;
    }
    Taro.setClipboardData({
      data: `${redBall.join(",")}+${blueBall}`
    });
  };
  const padZero = (value: string | number = "") => {
    const str = value.toString();
    if (str && str.length < 2) {
      return str.padStart(2, "0");
    }
    return str;
  };
  return <View className="numWrapper">
    <View className="redBallNum">
      {redBall.map((i, index) => <View key={index} className="squareItem">{padZero(i)}</View>)}
    </View>
    <View>+</View>
    <View className="squareItem">{padZero(blueBall)}</View>
    <View className="link" onClick={copy}>复制</View>
  </View>;
};
const Pocket: FC = () => {
  const [list, setList] = useState([initialNum]);
  const [repeatBlue, setRepeatBlue] = useState(false);
  const copyAll = () => {
    if (list.some(i => !i.blue || i.red.some(j => !j))) {
      errorToast("请先选号");
      return;
    }
    const newList = list.map(i => `${i.red.join(",")}+${i.blue}`);
    Taro.setClipboardData({
      data: newList.join("\n")
    });
  };
  const onAdd = () => {
    setList(arr => arr.concat(initialNum));
  };
  const chooseNum = () => {
    const blueList = generateNumList(16, list.length);
    const newList = list.map((i, index) => {
      const red = generateNumList();
      if (repeatBlue) {
        const [blue] = generateNumList(16, 1);
        return {red, blue};
      } else {
        return {red, blue: blueList[index]};
      }
    });
    setList(newList);
  };
  return <View className="pocket">
    <View className="filterWrapper">
      <View className="form">
        <View className="label">蓝球可重复：</View>
        <Switch checked={repeatBlue} onChange={e => setRepeatBlue(e.detail.value)}/>
      </View>
    </View>
    <View className="titleWrapper">
      <View>6个 <Text style={{color: "#d73838"}}>红球</Text> + 1个 <Text style={{color: "#366ad7"}}>蓝球</Text></View>
      <View className="btn add" onClick={onAdd}>加一注</View>
      <View className="btn chooseNum" onClick={chooseNum}>选号</View>
      <View className="link" onClick={copyAll}>全部复制</View>
    </View>
    {list.map((i, index) => <NumWrapper key={index} redBall={i.red} blueBall={i.blue}/>)}
  </View>;
};
export default Pocket;
