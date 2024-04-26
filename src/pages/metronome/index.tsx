import React, { useEffect, useMemo, useRef, useState } from "react";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { Image, Input, Picker, View } from "@tarojs/components";
import "./index.scss";
import cs from "classnames";
import startIcon from "@/images/common/start.svg";
import stopIcon from "@/images/common/stop.svg";
import voice from "@/audio/beat_cut.mp3";
import { AtIcon } from "taro-ui";
import { errorToast } from "@/utils/errorToast";
import { CommonBeatList } from "@/pages/metronome/constant";
import { IS_ALIPAY } from "@/utils/constant";

const Metronome: React.FC = () => {
  const [curN, setCurN] = useState<number>();
  const [beating, setBeating] = useState(false);
  const [selectNum, setSelectNum] = useState(8);
  const beatNum = useMemo(() => CommonBeatList[selectNum], [selectNum]);
  const [customBeatNum, setCustomBeatNum] = useState("");
  const isStop = useRef(true);
  const innerAudioContext = useRef<Taro.InnerAudioContext>();
  const timer = useRef<NodeJS.Timer>();
  const goBeatN = () => {
    innerAudioContext.current?.play();
    setCurN((_n) => {
      if (_n === undefined) {
        return 0;
      }
      const newN = _n + 1;
      return newN > 3 ? 0 : newN;
    });
  };
  const dropBeat = (beatTime: number) => {
    const frequency = Math.floor((60 * 1000) / beatTime);
    timer.current = setTimeout(() => {
      goBeatN();
      if (!isStop.current) {
        dropBeat(beatTime);
      } else {
        setCurN(undefined);
      }
    }, frequency);
  };
  const validate = () => {
    if (customBeatNum) {
      if (/\D/g.test(customBeatNum)) {
        return "请输入正确的自定义频率值";
      }
      if (Number(customBeatNum) > 208) {
        return "自定义频率值不得超过208";
      }
      if (Number(customBeatNum) < 1) {
        return "自定义频率值不得小于1";
      }
    }
  };
  const onToggle = () => {
    const msg = validate();
    if (msg) {
      errorToast(msg);
      return;
    }
    let beatTime = beatNum;
    if (customBeatNum) {
      beatTime = Number(customBeatNum);
    }
    setBeating(!beating);
    if (!beating) {
      isStop.current = false;
      goBeatN();
      dropBeat(beatTime);
    } else {
      isStop.current = true;
    }
  };
  useEffect(() => {
    innerAudioContext.current = Taro.createInnerAudioContext();
    innerAudioContext.current.src = voice;
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, []);
  useShareAppMessage(() => {
    return {
      title: "节拍器",
      path: "/pages/metronome/index",
    };
  });
  return (
    <View className={cs("metronome", IS_ALIPAY && "isAlipay")}>
      <View className="nodes">
        {new Array(4).fill("").map((i, n) => (
          <View className={cs("nodeItem", n === curN && "highLight")} />
        ))}
      </View>
      <View className="beatNum">
        <View
          className={cs("formItem", (customBeatNum || beating) && "disabled")}
        >
          <View className="label">常用节拍频率</View>
          {customBeatNum || beating ? (
            <View className="value">{beatNum}</View>
          ) : (
            <Picker
              value={selectNum}
              range={CommonBeatList}
              mode="selector"
              onChange={(e) => {
                setSelectNum(Number(e.detail.value));
              }}
            >
              <View className="right">
                <View className="value">{beatNum}</View>
                <AtIcon
                  className="icon"
                  value="chevron-right"
                  size="16"
                  color="#bfbfbf"
                />
              </View>
            </Picker>
          )}
        </View>
        <View className={cs("formItem", beating && "disabled")}>
          <View className="label">自定义节拍频率</View>
          <View className="right">
            <Input
              disabled={beating}
              value={customBeatNum}
              onInput={(e) => setCustomBeatNum(e.detail.value)}
              className="inputNum"
              type="number"
              placeholder="请输入1-208内整数"
            />
            <AtIcon
              onClick={() => !beating && setCustomBeatNum("")}
              className="icon"
              value="close-circle"
              size="16"
              color="#bfbfbf"
            />
          </View>
        </View>
      </View>
      <View className="actionBtn">
        <Image
          onClick={onToggle}
          src={beating ? stopIcon : startIcon}
          mode="aspectFill"
          className="btn"
        />
      </View>
    </View>
  );
};
export default Metronome;
