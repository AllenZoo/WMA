import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TermsOfService from "./TermsOfService";

const TermsOfServiceScreen = (
  props: NativeStackScreenProps<RootStackNavigatorParamsList, "TermsOfService">
) => {
  return <TermsOfService {...props} />;
};

export default TermsOfServiceScreen;
