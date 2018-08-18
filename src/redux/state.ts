import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";

export type VIEW_TYPE = "ALL_POSTS" | "ADD_OR_EDIT_POST" | "ADD_OR_EDIT_REVIEW";

export interface AppState {
  view: VIEW_TYPE;
  authedUsername?: string;

  usernames: string[];
  postIds: Array<number>;
  postMap: { [postId: number]: WirePost };
  reviewMap: { [postId: number]: Array<WireReview> };
}

const EMPTY_STRING_ARRAY: Array<string> = [];
const EMPTY_NUMBER_ARRAY: Array<number> = [];
const EMPTY_MAP = {};

export const INITIAL_STATE: AppState = { 
  view: "ALL_POSTS",
  usernames: EMPTY_STRING_ARRAY,
  postIds: EMPTY_NUMBER_ARRAY,
  postMap: EMPTY_MAP,
  reviewMap: EMPTY_MAP,
};
