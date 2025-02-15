declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "react-native-config" {
  export interface NativeConfig {
    SERVICE_PROTOCOL?: string;
    SERVICE_PORT?: string;
    SERVICE_URI?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
