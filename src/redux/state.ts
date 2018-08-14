import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";

export type VIEW_TYPE = "ALL_POSTS" | "ADD_OR_EDIT_POST" | "ADD_OR_EDIT_REVIEW";

export interface AppState {
  view: VIEW_TYPE;
  posts: WirePost[];
  reviewMap: { [postId: number]: WireReview[] };
  usernames: string[];
  authedUsername?: string;
  activePostId?: number;
}

const EMPTY_STRING_ARRAY: string[] = [];
const EMPTY_POST_ARRAY: WirePost[] = [];
const EMPTY_MAP = {};

export const INITIAL_STATE: AppState = { 
  view: "ALL_POSTS",
  posts: EMPTY_POST_ARRAY,
  reviewMap: EMPTY_MAP,
  usernames: EMPTY_STRING_ARRAY,
};
