import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../Navigation";

const useAppRoute = useRoute<RouteProp<RootStackParamList>>;

export default useAppRoute