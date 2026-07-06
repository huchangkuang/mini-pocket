import { getMe } from "@/services/authApi";
import {
  clearAuth,
  getToken,
  hydrateUserFromStorage,
  setSessionReady,
  setUser,
} from "@/utils/authStore";

export async function restoreSession(): Promise<void> {
  const token = getToken();
  if (!token) {
    setSessionReady(true);
    return;
  }

  hydrateUserFromStorage();

  try {
    const user = await getMe();
    setUser(user);
  } catch {
    clearAuth();
  } finally {
    setSessionReady(true);
  }
}
