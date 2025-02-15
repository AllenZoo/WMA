// loosely based on https://gist.github.com/jdthorpe/aaa0d31a598f299a57e5c76535bf0690
import { create } from "zustand";

import { api, AxiosError } from "@/utils/fetcher";

export const useUserStore = create<UserStoreConfig>((set, get) => ({
  // Note: User Id only gets set after user logs in.
  userId: null,
  signUp: async (loginUser: SignUpUser) => {
    const data = JSON.stringify(loginUser);
    const headers = {
      "Content-Type": "application/json",
    };
    await api
      .post("/auth/signup", data, { headers })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err.request._response);
      });
  },
  storeUserId: (userId: number) => set({ userId }),
}));
