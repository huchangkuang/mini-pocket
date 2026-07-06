import { useCallback, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import {
  clearAuth,
  getToken,
  getUser,
  hydrateUserFromStorage,
  isLoggedIn,
  isSessionReady,
  subscribe,
} from "@/utils/authStore";
import { performSilentLogin, restoreSession } from "@/utils/session";
import { syncDailyActive } from "@/utils/statsSync";
import type { ApiUserMe } from "@/types/api";
import { errorToast } from "@/utils/errorToast";

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
      const ok = await performSilentLogin();
      if (!ok) {
        throw new Error("登录失败，请稍后重试");
      }

      await syncDailyActive();
      Taro.showToast({ title: "登录成功", icon: "success", duration: 1500 });
      return true;
    } catch (e) {
      errorToast(e instanceof Error ? e.message : "登录失败，请稍后重试");
      return false;
    } finally {
      Taro.hideLoading();
      setLoggingIn(false);
    }
  }, [loggingIn]);

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
