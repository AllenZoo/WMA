import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PrivacyPolicy from "./PrivacyPolicy";

const PrivacyPolicyScreen = (
  props: NativeStackScreenProps<RootStackNavigatorParamsList, "PrivacyPolicy">
) => {
  return <PrivacyPolicy {...props} />;
};

export default PrivacyPolicyScreen;
