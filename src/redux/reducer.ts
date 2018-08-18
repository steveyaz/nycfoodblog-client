import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { SET_ACTIVE_POST, SET_ALL_POSTS, SET_ALL_REVIEWS, SET_AUTHED_USERNAME, SET_POST, SET_POST_IDS, SET_REVIEW, SET_USERNAMES, SET_VIEW } from "./action";
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
    case SET_POST_IDS:
      return { ...state, postIds: action.payload };
    case SET_POST:
      const post = action.payload as WirePost;
      const newPostMap = {};
      for (const postId of Object.keys(state.postMap)) {
        newPostMap[postId] = state.postMap[postId];
      }
      newPostMap[post.id!] = post;
      return { ...state, postMap: newPostMap }
    case SET_ALL_POSTS:
      return { ...state, postMap: action.payload };
    case SET_REVIEW:
      const review = action.payload as WireReview;
      const newReviewMap = {};
      for (const postId of Object.keys(state.reviewMap)) {
        if (state.reviewMap[postId].length > 0 && state.reviewMap[postId][0].postId === review.postId) {
          newReviewMap[postId] = [];
          for (const oldReview of state.reviewMap[postId]) {
            if (oldReview.username !== review.username) {
              newReviewMap[postId].push(oldReview);
            }
          }
        } else {
          newReviewMap[postId] = state.reviewMap[postId];
        }
      }
      if (newReviewMap[review.postId] === undefined) {
        newReviewMap[review.postId] = [];
      }
      newReviewMap[review.postId].push(review);
      return { ...state, reviewMap: newReviewMap }
    case SET_ALL_REVIEWS:
      return { ...state, reviewMap: action.payload };
    default:
      return state;
  }
}
