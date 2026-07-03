import React, { useState, useRef } from "react";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View, Text, Input, Button } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import cs from "classnames";
import "./index.scss";

const parseResult = (result: string) => {
  const match = result.match(/^(\d)A(\d)B$/);
  return match ? { a: match[1], b: match[2] } : { a: "0", b: "0" };
};

const GuessNumber: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<string[]>(["", "", "", ""]);
  const [guessNumber, setGuessNumber] = useState<string[]>(["", "", "", ""]);
  const [isTargetSet, setIsTargetSet] = useState<boolean>(false);
  const [results, setResults] = useState<
    Array<{ guess: string; result: string }>
  >([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isTargetFocused, setIsTargetFocused] = useState<boolean>(false);
  const [isGuessFocused, setIsGuessFocused] = useState<boolean>(false);

  const targetInputRef = useRef<HTMLInputElement | null>(null);
  const guessInputRef = useRef<HTMLInputElement | null>(null);

  useShareAppMessage(() => ({
    title: "猜数字游戏",
    path: "/pages/guessNumber/index",
  }));

  const handleTargetChange = (e: any) => {
    const value = e.detail.value;
    if (!/^\d{0,4}$/.test(value)) return;
    const newTarget = Array(4).fill("");
    for (let i = 0; i < value.length; i++) {
      newTarget[i] = value[i];
    }
    setTargetNumber(newTarget);
  };

  const handleGuessChange = (e: any) => {
    const value = e.detail.value;
    if (!/^\d{0,4}$/.test(value)) return;
    const newGuess = Array(4).fill("");
    for (let i = 0; i < value.length; i++) {
      newGuess[i] = value[i];
    }
    setGuessNumber(newGuess);
  };

  const focusTargetInput = () => {
    if (!isTargetSet) {
      targetInputRef.current?.focus();
    }
  };

  const focusGuessInput = () => {
    guessInputRef.current?.focus();
  };

  const handleSetTarget = () => {
    if (targetNumber.some((num) => num === "")) {
      Taro.showToast({ title: "请输入完整的四位数", icon: "none" });
      return;
    }
    setIsTargetSet(true);
  };

  const calculateResult = () => {
    let a = 0;
    let b = 0;
    const targetCopy = [...targetNumber];
    const guessCopy = [...guessNumber];

    for (let i = 0; i < 4; i++) {
      if (targetCopy[i] === guessCopy[i]) {
        a++;
        targetCopy[i] = "";
        guessCopy[i] = "";
      }
    }

    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== "") {
        const index = targetCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          b++;
          targetCopy[index] = "";
        }
      }
    }

    return `${a}A${b}B`;
  };

  const resetGame = () => {
    setTargetNumber(["", "", "", ""]);
    setGuessNumber(["", "", "", ""]);
    setIsTargetSet(false);
    setResults([]);
    setAttempts(0);
    setGameOver(false);
  };

  const handleVerify = () => {
    if (guessNumber.some((num) => num === "")) {
      Taro.showToast({ title: "请输入完整的四位数", icon: "none" });
      return;
    }

    const result = calculateResult();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    setResults([...results, { guess: guessNumber.join(""), result }]);
    setGuessNumber(["", "", "", ""]);

    if (result === "4A0B") {
      setGameOver(true);
      Taro.showModal({
        title: "恭喜猜对了！",
        content: `用了 ${newAttempts} 次`,
        confirmText: "重新开始",
        showCancel: false,
      }).then((res) => {
        if (res.confirm) {
          resetGame();
        }
      });
    }
  };

  const renderDigitCells = (
    digits: string[],
    options: {
      locked?: boolean;
      focused: boolean;
      onFocusGrid: () => void;
    }
  ) => {
    const inputLength = digits.join("").length;

    return (
      <View className="guessNumber__inputGrid" onClick={options.onFocusGrid}>
        {digits.map((num, index) => {
          const isFocused =
            options.focused && !options.locked && index === inputLength;

          return (
            <View
              key={index}
              className={cs("guessNumber__digit", {
                "guessNumber__digit--focused": isFocused,
                "guessNumber__digit--filled": !!num && !options.locked,
                "guessNumber__digit--locked": options.locked,
              })}
            >
              {options.locked ? "*" : num || ""}
              {isFocused && <View className="guessNumber__cursor" />}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="guessNumber">
      <View className="guessNumber__content">
        <View className="guessNumber__rules">
          <View className="guessNumber__rulesInner">
            <View className="guessNumber__rulesIcon">
              <AtIcon value="alert-circle" size="20" color="#005ea4" />
            </View>
            <View className="guessNumber__rulesBody">
              <Text className="guessNumber__rulesTitle">游戏规则</Text>
              <Text className="guessNumber__rulesLine">
                <Text className="guessNumber__rulesLabelA">A：</Text>
                位置和数字都正确
              </Text>
              <Text className="guessNumber__rulesLine">
                <Text className="guessNumber__rulesLabelB">B：</Text>
                数字正确但位置不正确
              </Text>
            </View>
          </View>
        </View>

        <View className="guessNumber__target">
          <View className="guessNumber__targetHeader">
            <Text className="guessNumber__sectionTitle">目标数字</Text>
            {isTargetSet && (
              <Text className="guessNumber__lockedBadge">已锁定</Text>
            )}
          </View>

          {renderDigitCells(targetNumber, {
            locked: isTargetSet,
            focused: isTargetFocused,
            onFocusGrid: focusTargetInput,
          })}

          <Input
            ref={targetInputRef}
            className="guessNumber__hiddenInput"
            value={targetNumber.join("")}
            onInput={handleTargetChange}
            onFocus={() => setIsTargetFocused(true)}
            onBlur={() => setIsTargetFocused(false)}
            disabled={isTargetSet}
            maxlength={4}
            type="number"
          />

          {!isTargetSet && (
            <Button
              className="guessNumber__primaryBtn"
              onClick={handleSetTarget}
            >
              锁定目标
            </Button>
          )}
        </View>

        {isTargetSet && !gameOver && (
          <View className="guessNumber__guess">
            <Text className="guessNumber__sectionTitle">猜测数字</Text>

            {renderDigitCells(guessNumber, {
              focused: isGuessFocused,
              onFocusGrid: focusGuessInput,
            })}

            <Input
              ref={guessInputRef}
              className="guessNumber__hiddenInput"
              value={guessNumber.join("")}
              onInput={handleGuessChange}
              onFocus={() => setIsGuessFocused(true)}
              onBlur={() => setIsGuessFocused(false)}
              maxlength={4}
              type="number"
            />

            <Button className="guessNumber__primaryBtn" onClick={handleVerify}>
              <AtIcon value="check-circle" size="20" color="#ffffff" />
              验证
            </Button>
          </View>
        )}

        {isTargetSet && (
          <View className="guessNumber__history">
            <Text className="guessNumber__sectionTitle">历史猜测</Text>

            <View className="guessNumber__historyList">
              {results.map((item, index) => {
                const { a, b } = parseResult(item.result);
                return (
                  <View key={index} className="guessNumber__historyItem">
                    <View className="guessNumber__historyLeft">
                      <Text className="guessNumber__historyIndex">
                        #{String(index + 1).padStart(2, "0")}
                      </Text>
                      <Text className="guessNumber__historyGuess">
                        {item.guess}
                      </Text>
                    </View>
                    <View className="guessNumber__historyBadges">
                      <Text className="guessNumber__badge guessNumber__badge--a">
                        {a}A
                      </Text>
                      <Text className="guessNumber__badge guessNumber__badge--b">
                        {b}B
                      </Text>
                    </View>
                  </View>
                );
              })}

              {results.length < 2 && (
                <View className="guessNumber__emptyState">
                  <Text className="guessNumber__emptyStateText">
                    继续猜测以查看更多历史
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default GuessNumber;
