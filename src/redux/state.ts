import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";

export interface AppState {
  authedUsername?: string;

  usernames: ReadonlyArray<string>;
  postMap: { [postId: number]: WirePost };
  reviewMap: { [postId: number]: ReadonlyArray<WireReview> };
}

const EMPTY_STRING_ARRAY: ReadonlyArray<string> = [];
const EMPTY_MAP = {};

export const INITIAL_STATE: AppState = { 
  usernames: EMPTY_STRING_ARRAY,
  postMap: EMPTY_MAP,
  reviewMap: EMPTY_MAP,
};
