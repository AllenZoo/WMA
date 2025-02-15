import { resolveTheme, useTheme } from "@/contexts/ThemeProvider";
import LoginScreen from "@/routes/login";
import { useAuthStore } from "@/stores/auth.store";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import MainScreen from "./main";
import React from "react";
import MainPageTabNavigator from "./main/MainPageTabNavigator";

const Stack = createNativeStackNavigator<RootStackNavigatorParamsList>();

const RootNavigator = () => {
  const { isSignedIn } = useAuthStore();
  const themes = useTheme();
  const navigationRef =
    useNavigationContainerRef<RootStackNavigatorParamsList>();

  const backOnlySettings: NativeStackNavigationOptions = {
    title: "Back",
    headerShown: false,
    headerBackVisible: false,
    headerTransparent: true,
    headerTintColor: resolveTheme(themes.colorScheme).colors.text, // TODO: fix scheme
  };

  const noAuthRoutes = () => {
    return (
      <>
        <Stack.Screen
          name="LoginMain"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="LoginSignIn"
          component={LoginScreen}
          options={{ ...backOnlySettings }}
        />
        <Stack.Screen
          name="LoginSignUp"
          component={LoginScreen}
          options={{ ...backOnlySettings }}
        />
        <Stack.Screen
          name="LoginSignUp2"
          component={LoginScreen}
          options={{ ...backOnlySettings }}
        />
        <Stack.Screen
          name="LoginSignUp3"
          component={LoginScreen}
          options={{ ...backOnlySettings }}
        />
        <Stack.Screen
          name="LoginSignUp4"
          component={LoginScreen}
          options={{ ...backOnlySettings }}
        />
      </>
    );
  };

  const requiresAuthRoutes = () => {
    return (
      <>
        {/* <Stack.Screen name="Main" component={MainScreen} /> */}
        <Stack.Screen
          name="MainPageTabNavigator"
          component={MainPageTabNavigator}
        />
      </>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onUnhandledAction={(error) => {
        if (!isSignedIn) {
          navigationRef.navigate("LoginMain");
        } else {
          // navigationRef.navigate("Main");
          navigationRef.navigate("MainPageTabNavigator");
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        // TODO: this breaks the app, figure out why.
        // initialRouteName="Main"
      >
        <Stack.Group>
          {/* {requiresAuthRoutes()} */}
          {!isSignedIn ? noAuthRoutes() : requiresAuthRoutes()}
          {/* <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ title: "Privacy Policy", headerShown: true }}
          />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfServiceScreen}
            options={{ title: "Terms of Service", headerShown: true }}
          /> */}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
