import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";

export const SET_VIEW = "SET_VIEW";
export const SET_AUTHED_USERNAME = "SET_AUTHED_USERNAME";
export const SET_USERNAMES = "SET_USERNAMES";
export const SET_POST = "SET_POST";
export const SET_ALL_POSTS = "SET_ALL_POSTS";
export const SET_REVIEW = "SET_REVIEW";
export const SET_ALL_REVIEWS = "SET_ALL_REVIEWS";

export const setAuthedUsername = (username: string | undefined) => ({ type: SET_AUTHED_USERNAME, payload: username });
export const setUsernames = (usernames: ReadonlyArray<string>) => ({ type: SET_USERNAMES, payload: usernames });
export const setPost = (post: WirePost) => ({ type: SET_POST, payload: post });
export const setAllPosts = (postMap: { [postId: number]: WirePost }) => ({ type: SET_ALL_POSTS, payload: postMap });
export const setReview = (review: WireReview) => ({ type: SET_REVIEW, payload: review });
export const setAllReviews = (reviewMap: { [postId: number]: ReadonlyArray<WireReview> }) => ({ type: SET_ALL_REVIEWS, payload: reviewMap });
