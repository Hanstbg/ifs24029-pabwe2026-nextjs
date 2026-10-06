import { describe, it, expect } from "vitest";
import {
  postsReducer,
  postReducer,
  isPostReducer,
  isPostAddReducer,
  isPostAddedReducer,
  isPostChangeReducer,
  isPostChangedReducer,
  isPostChangeCoverReducer,
  isPostChangedCoverReducer,
  isPostDeleteReducer,
  isPostDeletedReducer,
  isPostLikeReducer,
  isPostLikedReducer,
  isPostAddCommentReducer,
  isPostAddedCommentReducer,
  isPostDeleteCommentReducer,
  isPostDeletedCommentReducer,
  isPostDeleteAllReducer,
  isPostDeletedAllReducer,
} from "./reducer";
import { ActionType } from "./action";

describe("posts reducer", () => {
  it("should return the default state for unknown actions", () => {
    expect(postsReducer(undefined, {})).toEqual([]);
    expect(postReducer(undefined, {})).toBeNull();
    expect(isPostReducer(undefined, {})).toBe(false);
    expect(isPostAddReducer(undefined, {})).toBe(false);
    expect(isPostAddedReducer(undefined, {})).toBe(false);
    expect(isPostChangeReducer(undefined, {})).toBe(false);
    expect(isPostChangedReducer(undefined, {})).toBe(false);
    expect(isPostChangeCoverReducer(undefined, {})).toBe(false);
    expect(isPostChangedCoverReducer(undefined, {})).toBe(false);
    expect(isPostDeleteReducer(undefined, {})).toBe(false);
    expect(isPostDeletedReducer(undefined, {})).toBe(false);
    expect(isPostLikeReducer(undefined, {})).toBe(false);
    expect(isPostLikedReducer(undefined, {})).toBe(false);
    expect(isPostAddCommentReducer(undefined, {})).toBe(false);
    expect(isPostAddedCommentReducer(undefined, {})).toBe(false);
    expect(isPostDeleteCommentReducer(undefined, {})).toBe(false);
    expect(isPostDeletedCommentReducer(undefined, {})).toBe(false);
    expect(isPostDeleteAllReducer(undefined, {})).toBe(false);
    expect(isPostDeletedAllReducer(undefined, {})).toBe(false);
  });

  it("should handle SET_POSTS", () => {
    const action = { type: ActionType.SET_POSTS, payload: [{ id: 1 }] };
    expect(postsReducer([], action)).toEqual([{ id: 1 }]);
  });

  it("should handle SET_POST", () => {
    const action = { type: ActionType.SET_POST, payload: { id: 1 } };
    expect(postReducer(null, action)).toEqual({ id: 1 });
  });

  it("should handle SET_IS_POST", () => {
    const action = { type: ActionType.SET_IS_POST, payload: true };
    expect(isPostReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_ADD", () => {
    const action = { type: ActionType.SET_IS_POST_ADD, payload: true };
    expect(isPostAddReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_ADDED", () => {
    const action = { type: ActionType.SET_IS_POST_ADDED, payload: true };
    expect(isPostAddedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_CHANGE", () => {
    const action = { type: ActionType.SET_IS_POST_CHANGE, payload: true };
    expect(isPostChangeReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_CHANGED", () => {
    const action = { type: ActionType.SET_IS_POST_CHANGED, payload: true };
    expect(isPostChangedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_CHANGE_COVER", () => {
    const action = { type: ActionType.SET_IS_POST_CHANGE_COVER, payload: true };
    expect(isPostChangeCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_CHANGED_COVER", () => {
    const action = { type: ActionType.SET_IS_POST_CHANGED_COVER, payload: true };
    expect(isPostChangedCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETE", () => {
    const action = { type: ActionType.SET_IS_POST_DELETE, payload: true };
    expect(isPostDeleteReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETED", () => {
    const action = { type: ActionType.SET_IS_POST_DELETED, payload: true };
    expect(isPostDeletedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_LIKE", () => {
    const action = { type: ActionType.SET_IS_POST_LIKE, payload: true };
    expect(isPostLikeReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_LIKED", () => {
    const action = { type: ActionType.SET_IS_POST_LIKED, payload: true };
    expect(isPostLikedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_ADD_COMMENT", () => {
    const action = { type: ActionType.SET_IS_POST_ADD_COMMENT, payload: true };
    expect(isPostAddCommentReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_ADDED_COMMENT", () => {
    const action = { type: ActionType.SET_IS_POST_ADDED_COMMENT, payload: true };
    expect(isPostAddedCommentReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETE_COMMENT", () => {
    const action = { type: ActionType.SET_IS_POST_DELETE_COMMENT, payload: true };
    expect(isPostDeleteCommentReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETED_COMMENT", () => {
    const action = { type: ActionType.SET_IS_POST_DELETED_COMMENT, payload: true };
    expect(isPostDeletedCommentReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETE_ALL", () => {
    const action = { type: ActionType.SET_IS_POST_DELETE_ALL, payload: true };
    expect(isPostDeleteAllReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_POST_DELETED_ALL", () => {
    const action = { type: ActionType.SET_IS_POST_DELETED_ALL, payload: true };
    expect(isPostDeletedAllReducer(false, action)).toBe(true);
  });
});
