import { SET_ACTIVE_POST, SET_AUTHED_USERNAME, SET_USERNAMES, SET_VIEW } from "./action";
import { AppState, INITIAL_STATE } from "./state";

export const reducer = (state: AppState = INITIAL_STATE, action: { type: string; payload: {} }) => {
  switch (action.type) {
    case SET_VIEW:
      return { ...state, view: action.payload };
    case SET_ACTIVE_POST:
      return { ...state, activePostId: action.payload };
    case SET_AUTHED_USERNAME:
      return { ...state, authedUsername: action.payload };
    case SET_USERNAMES:
      return { ...state, usernames: action.payload };
    default:
      return state;
  }
}
