import React, { useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import MineTopBar from "@/components/mineTopBar";
import ProfileHeaderGuest from "@/components/profileHeaderGuest";
import ProfileHeaderLoggedIn from "@/components/profileHeaderLoggedIn";
import StatsGrid from "@/components/statsGrid";
import MineMenuList from "@/components/mineMenuList";
import MineAuthActions from "@/components/mineAuthActions";
import LevelProgress from "@/components/levelProgress";
import BottomNav from "@/components/bottomNav";
import { errorToast } from "@/utils/errorToast";
import {
  demoLoggedInUser,
  guestStats,
  loggedInStats,
  mineMenuItems,
  guestLevelProgress,
  loggedInLevelProgress,
} from "@/pages/mine/constants";
import "./index.scss";

const PLACEHOLDER_MSG = "更多功能正在开发中...";

const Mine: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleToggle = () => {
    setIsLoggedIn((prev) => !prev);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handlePlaceholder = () => {
    errorToast(PLACEHOLDER_MSG);
  };

  return (
    <View className="minePage">
      <MineTopBar
        onTerminal={handlePlaceholder}
        onNotification={handlePlaceholder}
      />

      <ScrollView scrollY className="minePage__scroll">
        <View className="minePage__content">
          {isLoggedIn ? (
            <ProfileHeaderLoggedIn
              user={demoLoggedInUser}
              onToggle={handleToggle}
              onEdit={handlePlaceholder}
            />
          ) : (
            <ProfileHeaderGuest onLogin={handleLogin} onToggle={handleToggle} />
          )}

          <StatsGrid items={isLoggedIn ? loggedInStats : guestStats} />

          <MineMenuList
            items={mineMenuItems}
            isLoggedIn={isLoggedIn}
            onItemClick={handlePlaceholder}
          />

          <MineAuthActions
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onSwitchAccount={handlePlaceholder}
            onLogout={handleLogout}
          />

          <LevelProgress
            variant={isLoggedIn ? "loggedIn" : "guest"}
            data={isLoggedIn ? loggedInLevelProgress : guestLevelProgress}
          />
        </View>
      </ScrollView>

      <BottomNav active="mine" />
    </View>
  );
};

export default Mine;
