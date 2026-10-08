import type { AppAction } from "@/types/action";
import { ActionType } from "./action";

export const usersReducer = (state = [], action: AppAction = {}) => {
  if (action.type === ActionType.SET_USERS) return action.payload;
  return state;
};

export const userReducer = (state = null, action: AppAction = {}) => {
  if (action.type === ActionType.SET_USER) return action.payload;
  return state;
};

export const profileReducer = (state = null, action: AppAction = {}) => {
  if (action.type === ActionType.SET_PROFILE) return action.payload;
  return state;
};

export const isProfileReducer = (state = false, action: AppAction = {}) => {
  if (action.type === ActionType.SET_IS_PROFILE) return action.payload;
  return state;
};

export const isChangeProfileReducer = (state = false, action: AppAction = {}) => {
  if (action.type === ActionType.SET_IS_CHANGE_PROFILE) return action.payload;
  return state;
};

export const isChangeProfilePhotoReducer = (state = false, action: AppAction = {}) => {
  if (action.type === ActionType.SET_IS_CHANGE_PROFILE_PHOTO) return action.payload;
  return state;
};

export const isChangeProfilePasswordReducer = (state = false, action: AppAction = {}) => {
  if (action.type === ActionType.SET_IS_CHANGE_PROFILE_PASSWORD) return action.payload;
  return state;
};