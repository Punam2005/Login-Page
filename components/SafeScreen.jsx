//import { Colors } from "@/app-example/constants/Colors";
import { View,Text } from "react-native";
import {COLORS} from "../constant/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const SafeScreen = ({ children }) => {
  const insets= useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top,backgroundColor:COLORS.background }}>
      {children}
    </View>
  );
  
}
export default SafeScreen;
