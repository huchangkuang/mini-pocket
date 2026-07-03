import React, { FC, memo } from "react";
import { View, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.scss";

export type MineAuthActionsProps = {
  isLoggedIn: boolean;
  onLogin?: () => void;
  onSwitchAccount?: () => void;
  onLogout?: () => void;
};

const MineAuthActions: FC<MineAuthActionsProps> = memo(
  ({ isLoggedIn, onLogin, onSwitchAccount, onLogout }) => {
    if (!isLoggedIn) {
      return (
        <View className="mineAuthActions">
          <View className="mineAuthActions__login" onClick={onLogin}>
            <AtIcon value="user" size="20" color="#ffffff" />
            <Text className="mineAuthActions__loginText">立即登录</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="mineAuthActions mineAuthActions--loggedIn">
        <View className="mineAuthActions__outline" onClick={onSwitchAccount}>
          <AtIcon value="streaming" size="18" color="#005ea4" />
          <Text className="mineAuthActions__outlineText">切换账号</Text>
        </View>
        <View className="mineAuthActions__logout" onClick={onLogout}>
          <AtIcon value="close" size="18" color="#404752" />
          <Text className="mineAuthActions__logoutText">退出登录</Text>
        </View>
      </View>
    );
  }
);

export default MineAuthActions;
