import React, { useEffect, useState } from "react";
import Taro, { Input, View } from "@tarojs/components";
import "./index.scss";
import { decisionConfig } from "@/pages/doDescription/store";
import { AtIcon } from "taro-ui";
import { errorToast } from "@/utils/errorToast";

const EditDecision: React.FC = () => {
  const [list, setList] = useState<string[]>(decisionConfig.list);
  const [title, setTitle] = useState(decisionConfig.title);
  const subtract = (index) => {
    if (list.length <= 2) {
      errorToast("至少保留两个选项");
      return;
    }
    setList((data) => data.filter((d, _ids) => _ids !== index));
  };
  useEffect(() => {
    decisionConfig.title = title;
    decisionConfig.list = list.map((i) => i.trim()).filter(Boolean);
  }, [title, list]);
  return (
    <View className="editDecision">
      <View className="title">去决定！！！</View>
      <Input
        className="titleInput"
        value={title}
        onInput={(e) => setTitle(e.detail.value)}
      />
      <View className="title">选择</View>
      {list.map((i, index) => (
        <View className="selectItem">
          <Input
            style={{ marginRight: "40rpx" }}
            value={i}
            onInput={(e) =>
              setList((data) =>
                data.map((d, _ids) => (_ids === index ? e.detail.value : d))
              )
            }
          />
          <AtIcon
            value="subtract-circle"
            size={20}
            onClick={() => subtract(index)}
          />
        </View>
      ))}
      <View className="addItem" onClick={() => setList([...list, ""])}>
        添加选项
      </View>
    </View>
  );
};
export default EditDecision;
