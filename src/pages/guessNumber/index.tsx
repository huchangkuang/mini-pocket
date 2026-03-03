import React, { useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Input, Button } from "@tarojs/components";
import "./index.scss";

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
    targetInputRef.current?.focus();
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

    // 计算 A（位置和数字都正确）
    for (let i = 0; i < 4; i++) {
      if (targetCopy[i] === guessCopy[i]) {
        a++;
        targetCopy[i] = "";
        guessCopy[i] = "";
      }
    }

    // 计算 B（数字正确但位置不正确）
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

  const handleVerify = () => {
    if (guessNumber.some((num) => num === "")) {
      Taro.showToast({ title: "请输入完整的四位数", icon: "none" });
      return;
    }

    const result = calculateResult();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    setResults([...results, { guess: guessNumber.join(""), result }]);

    if (result === "4A0B") {
      setGameOver(true);
      Taro.showToast({
        title: `恭喜！用了${newAttempts}次猜对了`,
        icon: "success",
      });
    }

    // 清空猜测输入
    setGuessNumber(["", "", "", ""]);
  };

  const resetGame = () => {
    setTargetNumber(["", "", "", ""]);
    setGuessNumber(["", "", "", ""]);
    setIsTargetSet(false);
    setResults([]);
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <View className="guessNumber">
      <View className="instructions">
        <Text>A：位置和数字都正确</Text>
        <Text>B：数字正确但位置不正确</Text>
      </View>

      <View className="targetSection">
        <View className="sectionTitle">目标数字</View>
        <View className="inputGrid" onClick={focusTargetInput}>
          {targetNumber.map((num, index) => {
            const inputLength = targetNumber.join("").length;
            const isFocused =
              isTargetFocused && !isTargetSet && index === inputLength;
            return (
              <View
                key={index}
                className={`numberInput ${
                  isFocused ? "numberInput-focused" : ""
                } ${num ? "numberInput-filled" : ""}`}
              >
                {isTargetSet ? "*" : num || ""}
                {isFocused && <View className="cursor"></View>}
              </View>
            );
          })}
        </View>
        <Input
          ref={targetInputRef}
          className="hiddenInput"
          value={targetNumber.join("")}
          onInput={handleTargetChange}
          onFocus={() => setIsTargetFocused(true)}
          onBlur={() => setIsTargetFocused(false)}
          disabled={isTargetSet}
          maxlength={4}
          type="number"
        />
        {!isTargetSet && (
          <Button className="setButton" onClick={handleSetTarget}>
            完成
          </Button>
        )}
      </View>

      {isTargetSet && !gameOver && (
        <View className="guessSection">
          <View className="sectionTitle">猜测数字</View>
          <View className="inputGrid" onClick={focusGuessInput}>
            {guessNumber.map((num, index) => {
              const inputLength = guessNumber.join("").length;
              const isFocused = isGuessFocused && index === inputLength;
              return (
                <View
                  key={index}
                  className={`numberInput ${
                    isFocused ? "numberInput-focused" : ""
                  } ${num ? "numberInput-filled" : ""}`}
                >
                  {num || ""}
                  {isFocused && <View className="cursor"></View>}
                </View>
              );
            })}
          </View>
          <Input
            ref={guessInputRef}
            className="hiddenInput"
            value={guessNumber.join("")}
            onInput={handleGuessChange}
            onFocus={() => setIsGuessFocused(true)}
            onBlur={() => setIsGuessFocused(false)}
            maxlength={4}
            type="number"
          />
          <Button className="verifyButton" onClick={handleVerify}>
            验证
          </Button>
        </View>
      )}

      {results.length > 0 && (
        <View className="resultsSection">
          <View className="sectionTitle">历史猜测</View>
          {results.map((item, index) => (
            <View key={index} className="resultItem">
              <Text className="guessText">{item.guess}</Text>
              <Text className="resultText">{item.result}</Text>
            </View>
          ))}
        </View>
      )}

      {gameOver && (
        <View className="gameOverSection">
          <Text className="gameOverText">恭喜！用了 {attempts} 次猜对了</Text>
          <Button className="resetButton" onClick={resetGame}>
            重新开始
          </Button>
        </View>
      )}
    </View>
  );
};

export default GuessNumber;
