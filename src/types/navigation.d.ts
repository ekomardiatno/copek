import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../Navigation";

export type AppRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;