import { SET_SESSION } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';

export type SessionStateType = {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
};

export type SimpleLocationType = {
  latitude: number;
  longitude: number;
};

const initialState: {
  session: SessionStateType | null;
} = {
  session: null,
};

const appReducer = (
  state = initialState,
  action: PayloadAction<any>,
) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SESSION:
      return {
        ...state,
        session: payload as SessionStateType | null,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, appReducer);
