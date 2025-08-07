import AsyncStorage from "@react-native-async-storage/async-storage"
import { REDUX_KEY_NAME } from "../constants"

const persistConfig = {
  key: REDUX_KEY_NAME,
  storage: AsyncStorage
}

export default persistConfig