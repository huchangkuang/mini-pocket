import { useCallback, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { wechatLogin } from "@/services/authApi";
import {
  clearAuth,
  getToken,
  getUser,
  hydrateUserFromStorage,
  isLoggedIn,
  isSessionReady,
  setToken,
  setUser,
  subscribe,
} from "@/utils/authStore";
import { restoreSession } from "@/utils/session";
import { syncDailyActive } from "@/utils/statsSync";
import type { ApiUserMe } from "@/types/api";
import { ApiError } from "@/utils/request";
import { errorToast } from "@/utils/errorToast";
import { DEFAULT_USER_LEVEL } from "@/utils/levelMapper";

export function useAuth() {
  const [user, setUserState] = useState<ApiUserMe | null>(() => {
    hydrateUserFromStorage();
    return getUser();
  });
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()));
  const [ready, setReady] = useState(() => isSessionReady());
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    return subscribe(() => {
      setUserState(getUser());
      setLoggedIn(isLoggedIn());
      setReady(isSessionReady());
    });
  }, []);

  // 冷启动：app.ts 校验 token 完成前，先用本地缓存展示已登录态
  useEffect(() => {
    if (!isSessionReady() && getToken()) {
      hydrateUserFromStorage();
      setLoggedIn(true);
      setUserState(getUser());
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await restoreSession();
  }, []);

  const login = useCallback(async () => {
    if (loggingIn) return false;

    setLoggingIn(true);
    Taro.showLoading({ title: "登录中...", mask: true });

    try {
      const { code } = await Taro.login();
      if (!code) {
        throw new Error("获取微信登录凭证失败");
      }

      const result = await wechatLogin(code);
      setToken(result.token);
      setUser({
        ...result.user,
        stats: {
          favoriteCount: 0,
          activeDaysCount: 0,
          usedToolsCount: 0,
          totalXp: 0,
        },
        level: DEFAULT_USER_LEVEL,
      });

      await refreshProfile();
      await syncDailyActive();

      Taro.showToast({ title: "登录成功", icon: "success", duration: 1500 });
      return true;
    } catch (e) {
      if (e instanceof ApiError) {
        errorToast(e.message);
      } else if (e instanceof Error) {
        errorToast(e.message);
      } else {
        errorToast("登录失败，请稍后重试");
      }
      return false;
    } finally {
      Taro.hideLoading();
      setLoggingIn(false);
    }
  }, [loggingIn, refreshProfile]);

  const logout = useCallback(() => {
    clearAuth();
    Taro.showToast({ title: "已退出登录", icon: "none", duration: 1500 });
  }, []);

  return {
    user,
    isLoggedIn: loggedIn,
    isReady: ready,
    loggingIn,
    login,
    logout,
    refreshProfile,
  };
}

export function promptLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    Taro.showModal({
      title: "需要登录",
      content: "登录后可同步收藏到云端，是否前往登录？",
      confirmText: "去登录",
      success: (res) => {
        if (res.confirm) {
          Taro.switchTab({ url: "/pages/mine/index" });
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: () => resolve(false),
    });
  });
}
