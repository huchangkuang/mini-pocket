import React, { useEffect, useState } from "react";
import { Input, View } from "@tarojs/components";
import "./index.scss";
import {
  addLocalItem,
  decisionConfig,
  getDecisionId,
  updateLocalItem,
} from "@/pages/doDescription/store";
import { AtIcon, AtButton } from "taro-ui";
import { errorToast } from "@/utils/errorToast";
import Taro, {
  navigateBack,
  useRouter,
  setNavigationBarTitle,
} from "@tarojs/taro";

const EditDecision: React.FC = () => {
  const {
    params: { type = "edit", id = "" },
  } = useRouter();
  const isAdd = type === "add";
  const [list, setList] = useState<string[]>(decisionConfig.list);
  const [title, setTitle] = useState(decisionConfig.title);
  const subtract = (index: number) => {
    if (list.length <= 2) {
      errorToast("至少保留两个选项");
      return;
    }
    setList((data) => data.filter((d, _ids) => _ids !== index));
  };
  const onSave = () => {
    const newList = list.map((i) => i.trim()).filter(Boolean);
    if (newList.length < 2) {
      errorToast("至少填写两个选项");
      return;
    }
    decisionConfig.title = title;
    decisionConfig.list = newList;
    navigateBack();
    updateItem();
  };
  const updateItem = () => {
    if (isAdd || !id) {
      const id = getDecisionId() as string;
      addLocalItem({ id, title, list });
    } else {
      updateLocalItem({ id, title, list });
    }
  };
  useEffect(() => {
    if (isAdd) {
      setNavigationBarTitle({ title: "添加常用" });
    }
  }, []);
  return (
    <View className="editDecision">
      <View className="title">去决定！！！</View>
      <Input
        maxlength={20}
        className="titleInput"
        value={title}
        onInput={(e) => setTitle(e.detail.value)}
      />
      <View className="title">选择</View>
      {list.map((i, index) => (
        <View className="selectItem">
          <Input
            maxlength={20}
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
      <AtButton
        className="addItem"
        type="secondary"
        onClick={() => setList([...list, ""])}
      >
        添加选项
      </AtButton>
      <AtButton type="primary" onClick={onSave}>
        保存
      </AtButton>
    </View>
  );
};
export default EditDecision;
