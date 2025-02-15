import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const accessTokenKey = "auth-accessToken";
const refreshTokenKey = "auth-refreshToken";

const storeRefreshToken = async (token: string) =>
  setItemAsync(refreshTokenKey, JSON.stringify(token));
const fetchRefreshToken = async () => getItemAsync(refreshTokenKey);
const deleteRefreshToken = async () => deleteItemAsync(refreshTokenKey);

const storeAccessToken = async (token: string) =>
  setItemAsync(accessTokenKey, JSON.stringify(token));
const fetchAccessToken = async () => getItemAsync(accessTokenKey);
const deleteAccessToken = async () => deleteItemAsync(accessTokenKey);

export {
  accessTokenKey,
  deleteAccessToken,
  deleteRefreshToken,
  fetchAccessToken,
  fetchRefreshToken,
  refreshTokenKey,
  storeAccessToken,
  storeRefreshToken,
};
