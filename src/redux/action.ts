import { VIEW_TYPE } from "./state";

export const SET_VIEW = "SET_VIEW";
export const SET_ACTIVE_POST = "SET_ACTIVE_POST";
export const SET_AUTHED_USERNAME = "SET_AUTHED_USERNAME";
export const SET_USERNAMES = "SET_USERNAMES";

export const setView = (viewType: VIEW_TYPE) => ({ type: SET_VIEW, payload: viewType });
export const setActivePost = (postId: number | undefined) => ({ type: SET_ACTIVE_POST, payload: postId });
export const setAuthedUsername = (username: string | undefined) => ({ type: SET_AUTHED_USERNAME, payload: username });
export const setUsernames = (usernames: Array<string>) => ({ type: SET_USERNAMES, payload: usernames });
