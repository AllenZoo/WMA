module.exports = {
  name: "WMA.Client",
  slug: "wma-client",
  scheme: "com.wma.vlf",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    usesAppleSignIn: true,
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  experiments: {
    tsconfigPaths: true,
  },
  plugins: ["expo-apple-authentication"],
};
