import AsyncStorage from "@react-native-async-storage/async-storage";

import { createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => AsyncStorage);

export default storage;
