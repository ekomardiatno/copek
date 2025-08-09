import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";

const useCustomNavigation = useNavigation<
  NativeStackNavigationProp<RootStackParamList>
>;

export default useCustomNavigation