// loosely based on https://gist.github.com/jdthorpe/aaa0d31a598f299a57e5c76535bf0690
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import { api, AxiosError } from "@/utils/fetcher";
import {
  deleteAccessToken,
  deleteRefreshToken,
  fetchAccessToken,
  fetchRefreshToken,
  storeAccessToken,
  storeRefreshToken,
} from "./keys.store";

import { useUserStore } from "./user.store";

export const useAuthStore = create<AuthStoreConfig>((set, get) => ({
  user: null,
  isSignedIn: false,
  hasTriedCache: false,
  setHasTriedCache: (hasTriedCache: boolean) => set({ hasTriedCache }),
  authError: null,
  setAuthError: (authError: string | null) => set({ authError }),

  signIn: async (credentials: SignInUser) => {
    const data = JSON.stringify(credentials);
    const headers = {
      "Content-Type": "application/json",
    };
    const request = api.post("/auth/login", data, { headers });
    await request
      .then((res) => {
        console.log(res.data);
        get().setTokenResponse(res.data as Jwt);
      })
      .catch((err: AxiosError) => {
        console.log(err);
        set({
          authError: (err.response?.data as string) ?? "Something went wrong",
        });
      });
  },

  signOut: async () => {
    set({
      user: null,
      authError: null,
      isSignedIn: false,
    });
    deleteRefreshToken();
    deleteAccessToken();
    //? OPTIONAL - revoke token from server
  },

  setTokenResponse: async (responseToken: Jwt) => {
    // cache the token for next time
    // const tokenConfig: TokenResponseConfig = (
    //   responseToken as TokenResponse
    // ).getRequestConfig();
    const { accessToken, refreshToken, userId } = responseToken;
    refreshToken && (await storeRefreshToken(refreshToken));

    // extract the user info
    if (!accessToken) return;
    const decoded = jwtDecode(accessToken);
    set({ user: { accessToken, decoded }, isSignedIn: true });
    await storeAccessToken(accessToken);

    // store the userId
    const { storeUserId } = useUserStore.getState();
    storeUserId(userId);
  },

  tryRestoreSession: async () => {
    const refreshToken = await fetchRefreshToken();
    const accessToken = await fetchAccessToken();
    if (!refreshToken || !accessToken) return;
    const decoded = jwtDecode(accessToken);
    set({ user: { accessToken, decoded }, authError: null, isSignedIn: true });
  },

  refresh: async () => {
    const refreshToken = await fetchRefreshToken();
    if (!refreshToken) return;
    // TODO: handle refreshing
  },
}));
