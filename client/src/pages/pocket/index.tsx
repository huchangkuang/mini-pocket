import React, {FC, useState} from 'react';
import Taro from '@tarojs/taro';
import {View, Text, Switch, Image} from "@tarojs/components";
import './index.less';
import {errorToast} from "@/utils/errorToast";
import {generateNumList, randomNum} from "@/utils/generateNum";
import subtract from "../../images/pocket/subtract.svg"

type RedBall = (number | string)[];
type BlueBall = number | string;
type NumWrapperProps = {
  redBall?: RedBall;
  blueBall?: BlueBall;
  onSubtract?: () => void;
}
const initialNum: {
  red: RedBall;
  blue: BlueBall;
} = {
  red: ["", "", "", "", "", ""],
  blue: ""
};
const NumWrapper: FC<NumWrapperProps> = ({redBall = [], blueBall = "", onSubtract}) => {
  const copy = () => {
    if (!blueBall || redBall.some(i => !i)) {
      errorToast("请先选号");
      return;
    }
    Taro.setClipboardData({
      data: `${redBall.join(",")}+${blueBall}`
    });
  };
  return <View className="numWrapper">
    <View className="redBallNum">
      {redBall.map((i, index) => <View key={index} className="squareItem">{i}</View>)}
    </View>
    <View>+</View>
    <View className="squareItem noRight">{blueBall}</View>
    <View className="link" onClick={copy}>复制</View>
    <Image className="subtract" src={subtract} onClick={onSubtract} />
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
    if (list.length >= 16) return errorToast("不可再添加了")
    setList(arr => arr.concat(initialNum));
  };
  const padZero = (value: string | number = "") => {
    const str = value.toString();
    if (str && str.length < 2) {
      return str.padStart(2, "0");
    }
    return str;
  };
  const chooseNum = () => {
    const blueList = generateNumList(16, list.length).map(i => padZero(i));
    const newList = list.map((i, index) => {
      const red = generateNumList().map(r => padZero(r));
      if (repeatBlue) {
        const blue = padZero(randomNum(1, 16));
        return {red, blue};
      } else {
        return {red, blue: blueList[index]};
      }
    });
    setList(newList);
  };
  const onNumScroll = () => {
    let i = 0
    const clock = setInterval(() => {
      if (i >= 10) {
        clearInterval(clock)
        return;
      }
      chooseNum()
      i += 1
    }, 100)
  }
  const removeItem = (index: number) => {
    const newList = list.filter((i, ids) => ids !== index)
    setList(newList)
  }
  return <View className="pocket">
    <View className="content">
      <View className="filterWrapper">
        <View className="form">
          <View className="label">蓝球可重复：</View>
          <Switch checked={repeatBlue} onChange={e => setRepeatBlue(e.detail.value)}/>
        </View>
      </View>
      <View className="titleWrapper">
        <View>6个 <Text style={{color: "#d73838"}}>红球</Text> + 1个 <Text style={{color: "#366ad7"}}>蓝球</Text></View>
        <View className="btn add" onClick={onAdd}>加一注</View>
        {/*<View className="btn chooseNum" onClick={chooseNum}>选号</View>*/}
        <View className="link" onClick={copyAll}>全部复制</View>
      </View>
      {list.map((i, index) => <NumWrapper key={index} onSubtract={() => removeItem(index)} redBall={i.red} blueBall={i.blue}/>)}
    </View>
    <View className="chooseNumWrapper">
      <View className="chooseNum" onClick={onNumScroll}>选号</View>
    </View>
  </View>;
};
export default Pocket;
