import Constants from "expo-constants";

type IConfigs = typeof Constants.expoConfig & {};

export default Constants.expoConfig as IConfigs;
