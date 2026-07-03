import React, { useMemo, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";
import Taro, {
  getMenuButtonBoundingClientRect,
  getStorageSync,
  getSystemInfoSync,
  navigateTo,
  showActionSheet,
  showModal,
  useDidShow,
  useShareAppMessage,
} from "@tarojs/taro";
import type { Accent } from "@/pages/classify/constants";
import decisionIcon from "@/images/classify/decision.svg";
import {
  decisionConfig,
  DecisionItem,
  deleteLocalItem,
  USE_LIST,
} from "@/pages/doDescription/store";

/** 扇区底色：两色交替；奇数项时最后一扇用第三色，避免与第一扇同色相邻 */
const SEGMENT_COLORS = ["#f2f4f7", "#ffffff", "#eceef1"];

const getSegmentColor = (index: number, total: number) => {
  if (total % 2 === 1 && index === total - 1) {
    return SEGMENT_COLORS[2];
  }
  return SEGMENT_COLORS[index % 2];
};
const SPIN_DURATION_MS = 4000;
const ACCENTS: Accent[] = ["primary", "tertiary", "secondary"];

const DoDecision: React.FC = () => {
  const [itemList, setItemList] = useState(decisionConfig.list);
  const [title, setTitle] = useState(decisionConfig.title);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [useList, setUseList] = useState<
    (typeof decisionConfig & { id: string })[]
  >(getStorageSync(USE_LIST) || []);
  const [selectId, setSelectId] = useState<string>();

  const { windowWidth = 375 } = getSystemInfoSync();
  const menuRect = getMenuButtonBoundingClientRect();
  const menuBtnStyle = {
    top: `${menuRect.top}px`,
    height: `${menuRect.height}px`,
    right: `${windowWidth - menuRect.right + menuRect.width + 8}px`,
  };

  const segmentDeg = useMemo(
    () => (itemList.length > 0 ? 360 / itemList.length : 60),
    [itemList.length]
  );

  const conicGradientStyle = useMemo(() => {
    const n = itemList.length;
    if (n === 0) return SEGMENT_COLORS[0];
    const step = 360 / n;
    return itemList
      .map((_, index) => {
        const color = getSegmentColor(index, n);
        const start = index * step;
        const end = (index + 1) * step;
        return `${color} ${start}deg, ${color} ${end}deg`;
      })
      .join(", ");
  }, [itemList.length]);

  /** 逆时针偏移半扇区，使第 0 项对准 12 点指针 */
  const wheelRotation = rotateDeg - segmentDeg / 2;

  const decide = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const extraSpins = (5 + Math.random() * 5) * 360;
    const finalAngle = Math.random() * 360;
    setRotateDeg((prev) => prev + extraSpins + finalAngle);

    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    spinTimerRef.current = setTimeout(() => {
      setIsSpinning(false);
      // TODO: 旋转结束后展示选中结果（Modal 或 Toast）
    }, SPIN_DURATION_MS);
  };

  const selectCurItem = (item: DecisionItem) => {
    if (selectId === item.id) {
      setSelectId(undefined);
      decisionConfig.id = undefined;
      return;
    }
    setSelectId(item.id);
    setTitle(item.title);
    setItemList(item.list);
    decisionConfig.id = item.id;
    decisionConfig.title = item.title;
    decisionConfig.list = item.list;
    setRotateDeg(0);
  };

  const goEdit = () => {
    navigateTo({
      url: `/pages/doDescription/edit/index${
        selectId ? `?id=${selectId}&type=edit` : "?type=edit"
      }`,
    });
  };

  const goAdd = () => {
    navigateTo({ url: "/pages/doDescription/edit/index?type=add" });
  };

  const handleDeleteSelected = () => {
    if (!selectId) return;
    const item = useList.find((i) => i.id === selectId);
    showModal({
      title: "删除确认",
      content: `是否删除「${item?.title ?? "此常用"}」？`,
      success(res) {
        if (res.confirm && selectId) {
          deleteLocalItem(selectId);
          setUseList(getStorageSync(USE_LIST) || []);
          setSelectId(undefined);
          decisionConfig.id = undefined;
        }
      },
    });
  };

  const openMenu = () => {
    const itemList = selectId ? ["删除此常用", "分享给朋友"] : ["分享给朋友"];
    showActionSheet({
      itemList,
      success(res) {
        if (res.tapIndex === 0 && selectId) {
          handleDeleteSelected();
        } else if (
          (selectId && res.tapIndex === 1) ||
          (!selectId && res.tapIndex === 0)
        ) {
          Taro.showToast({ title: "请点击右上角菜单分享", icon: "none" });
        }
      },
    });
  };

  useDidShow(() => {
    setTitle(decisionConfig.title);
    setItemList(decisionConfig.list);
    setRotateDeg(0);
    setIsSpinning(false);
    setUseList(getStorageSync(USE_LIST) || []);
    if (decisionConfig.id) {
      setSelectId(decisionConfig.id);
    }
  });

  useShareAppMessage(() => ({
    title: "做个决定",
    path: "/pages/doDescription/index",
  }));

  return (
    <View className="doDescription">
      <View
        className="doDescription__menuBtn"
        style={menuBtnStyle}
        onClick={openMenu}
      >
        <AtIcon value="more" size="18" color="#191c1e" />
      </View>

      <ScrollView scrollY className="doDescription__scroll">
        <View className="doDescription__content">
          <View className="doDescription__questionCard">
            <View className="doDescription__questionMain">
              <Text className="doDescription__questionLabel">当前问题</Text>
              <Text className="doDescription__questionTitle">{title}</Text>
            </View>
            <View className="doDescription__editBtn" onClick={goEdit}>
              <AtIcon value="edit" size="16" color="#0077ce" />
            </View>
          </View>

          <View className="doDescription__wheelSection">
            <View className="doDescription__pointer">
              <AtIcon value="map-pin" size="20" color="#005ea4" />
            </View>
            <View className="doDescription__wheelWrap">
              <View
                className="doDescription__wheel"
                style={{
                  background: `conic-gradient(${conicGradientStyle})`,
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning
                    ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0, 0.15, 1)`
                    : "none",
                }}
              >
                {itemList.map((label, index) => (
                  <View
                    key={`${label}-${index}`}
                    className="doDescription__wheelLabel"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${
                        segmentDeg * index + segmentDeg / 2
                      }deg)`,
                    }}
                  >
                    <Text className="doDescription__wheelLabelText">
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                className="doDescription__goBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  decide();
                }}
              >
                <Text className="doDescription__goText">GO</Text>
                <Text className="doDescription__spinText">SPIN</Text>
              </View>
            </View>
          </View>

          <Text className="doDescription__hint">
            摇摆不定？点击按钮，让命运来为你做决定。
          </Text>

          <View className="doDescription__recent">
            <View className="doDescription__recentHeader">
              <Text className="doDescription__recentTitle">最近常用</Text>
              <View className="doDescription__newBtn" onClick={goAdd}>
                <AtIcon value="add" size="12" color="#005ea4" />
                <Text className="doDescription__newBtnText">新建</Text>
              </View>
            </View>

            {useList.length === 0 ? (
              <View className="doDescription__empty">
                <Text className="doDescription__emptyText">
                  还没有常用决定，点「新建」添加你的决策场景
                </Text>
              </View>
            ) : (
              <View className="doDescription__recentList">
                {useList.map((item, index) => {
                  const accent = ACCENTS[index % ACCENTS.length];
                  const preview =
                    item.list.length > 4
                      ? `${item.list.slice(0, 4).join(", ")}, ...`
                      : item.list.join(", ");
                  return (
                    <View
                      key={item.id}
                      className={`doDescription__recentItem doDescription__recentItem--${accent}${
                        selectId === item.id
                          ? " doDescription__recentItem--selected"
                          : ""
                      }`}
                      onClick={() => selectCurItem(item)}
                    >
                      <View
                        className={`doDescription__recentIcon doDescription__recentIcon--${accent}`}
                      >
                        <Image
                          className="doDescription__recentIconImg"
                          src={decisionIcon}
                          mode="aspectFit"
                        />
                      </View>
                      <View className="doDescription__recentBody">
                        <Text className="doDescription__recentItemTitle">
                          {item.title}
                        </Text>
                        <Text className="doDescription__recentItemOpts">
                          选项：{preview}
                        </Text>
                      </View>
                      <AtIcon value="chevron-right" size="14" color="#c0c7d4" />
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View
            className={`doDescription__cta${
              isSpinning ? " doDescription__cta--disabled" : ""
            }`}
            onClick={decide}
          >
            <AtIcon value="reload" size="18" color="#ffffff" />
            <Text className="doDescription__ctaText">开始抽取</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DoDecision;
