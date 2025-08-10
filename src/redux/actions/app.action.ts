import { SessionStateType } from "../reducers/app.reducer";
import { SET_SESSION } from "../types";

export const setSession = (session: SessionStateType | null) => ({
  type: SET_SESSION,
  payload: session,
});