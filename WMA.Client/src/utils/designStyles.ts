import { Platform } from "react-native";

// Eg. big page headings: Home, Exercise, Profile
export const TEXT_HEADING_L =
  "font-bold text-4xl text-light-foreground dark:text-dark-foreground";

// Eg. Currently not used but could be useful
export const TEXT_HEADING_M =
  "text-3xl text-light-foreground dark:text-dark-foreground";

// Eg. Subheadings like Filter Modal, etc.
export const TEXT_HEADING_S =
  "text-2xl text-light-foreground dark:text-dark-foreground";

// Body
export const TEXT_BODY_L =
  "text-lg text-light-foreground dark:text-dark-foreground";

// Footer
export const TEXT_BODY_M =
  "text-base text-light-foreground dark:text-dark-foreground";

// Super Small
export const TEXT_BODY_S =
  "text-sm text-light-foreground dark:text-dark-foreground";

// Background styling for primary buttons
export const BG_COLOUR_BUTTON_PRIMARY =
  "bg-light-primary active:bg-light-primary/75 dark:bg-dark-primary active:dark:bg-dark-primary";

// Background styling for secondary buttons
export const BG_COLOUR_BUTTON_SECONDARY =
  "bg-light-secondary-100 active:bg-light-secondary-100/75 dark:bg-dark-secondary-100 active:dark:bg-dark-secondary-100";

// Primary Colour
export const BG_COLOUR_PRIMARY_1 = "bg-light-primary dark:bg-dark-primary";

// Primary Colour 2
export const BG_COLOUR_PRIMARY_2 =
  "bg-light-primary-100 dark:bg-dark-primary-100";

// Secondary Colour
export const BG_COLOUR_SECONDARY_1 =
  "bg-light-secondary dark:bg-dark-secondary";

// Secondary Colour 2
export const BG_COLOUR_SECONDARY_2 =
  "bg-light-secondary-100 dark:bg-dark-secondary-100";

// TODO: add text colours

// Shadow styles object to handle platform-specific shadow implementation
export const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  android: {
    elevation: 3,
  },
});
