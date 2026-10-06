import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setPostsActionCreator,
  asyncSetPosts,
  setPostActionCreator,
  setIsPostActionCreator,
  asyncSetPost,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
  asyncSetIsPostAdd,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
  asyncSetIsPostChange,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedCoverActionCreator,
  asyncSetIsPostChangeCover,
  setIsPostDeleteActionCreator,
  setIsPostDeletedActionCreator,
  asyncSetIsPostDelete,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
  asyncSetIsPostLike,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  asyncSetIsPostAddComment,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  asyncSetIsPostDeleteComment,
  setIsPostDeleteAllActionCreator,
  setIsPostDeletedAllActionCreator,
  asyncSetIsPostDeleteAll,
} from "./action";
import postApi from "../api/postApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("posts action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create action objects correctly", () => {
    expect(setPostsActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_POSTS,
      payload: [{ id: 1 }],
    });
    expect(setPostActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_POST,
      payload: { id: 1 },
    });
    expect(setIsPostActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST,
      payload: true,
    });
    expect(setIsPostAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD,
      payload: true,
    });
    expect(setIsPostAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED,
      payload: true,
    });
    expect(setIsPostChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE,
      payload: true,
    });
    expect(setIsPostChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED,
      payload: true,
    });
    expect(setIsPostChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE_COVER,
      payload: true,
    });
    expect(setIsPostChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED_COVER,
      payload: true,
    });
    expect(setIsPostDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE,
      payload: true,
    });
    expect(setIsPostDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED,
      payload: true,
    });
    expect(setIsPostLikeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKE,
      payload: true,
    });
    expect(setIsPostLikedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKED,
      payload: true,
    });
    expect(setIsPostAddCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD_COMMENT,
      payload: true,
    });
    expect(setIsPostAddedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_COMMENT,
      payload: true,
    });
    expect(setIsPostDeletedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_ALL,
      payload: true,
    });
    expect(setIsPostDeletedAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_ALL,
      payload: true,
    });
  });

  describe("asyncSetPosts", () => {
    it("should dispatch setPostsActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPosts").mockResolvedValue([{ id: 1 }]);

      await asyncSetPosts("1")(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([{ id: 1 }]));
    });

    it("should dispatch empty array on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPosts").mockRejectedValue(new Error("Err"));

      await asyncSetPosts()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([]));
    });
  });

  describe("asyncSetPost", () => {
    it("should dispatch setPostActionCreator and setIsPost on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPostById").mockResolvedValue({ id: 1 });

      await asyncSetPost(1)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
    });

    it("should dispatch null and setIsPost on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPostById").mockRejectedValue(new Error("Err"));

      await asyncSetPost(99)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
    });
  });

  describe("asyncSetIsPostAdd", () => {
    it("should post new post, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPost").mockResolvedValue({ post_id: 1 });
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostAdd("Deskripsi")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Postingan berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddActionCreator(true));
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPost").mockRejectedValue(new Error("Gagal tambah"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostAdd("Deskripsi")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal tambah");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddActionCreator(true));
    });
  });

  describe("asyncSetIsPostChange", () => {
    it("should update post, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockResolvedValue("Postingan diubah");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostChange(1, "Deskripsi baru")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Postingan diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeActionCreator(true));
    });

    it("should use fallback success message when api returns empty string", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostChange(1, "Deskripsi baru")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Postingan berhasil diperbarui!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockRejectedValue(new Error("Gagal update"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostChange(1, "Deskripsi baru")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal update");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeActionCreator(true));
    });
  });

  describe("asyncSetIsPostChangeCover", () => {
    it("should upload cover, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPostCover").mockResolvedValue("Cover diubah");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Cover diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeCoverActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPostCover").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPostCover").mockRejectedValue(new Error("File corrupt"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("File corrupt");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeCoverActionCreator(true));
    });
  });

  describe("asyncSetIsPostDelete", () => {
    it("should delete post, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockResolvedValue("Postingan dihapus");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDelete(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Postingan dihapus");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDelete(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Postingan berhasil dihapus!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockRejectedValue(new Error("Gagal hapus"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDelete(1)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal hapus");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteActionCreator(true));
    });
  });

  describe("asyncSetIsPostLike", () => {
    it("should like post, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockResolvedValue("Suka diubah");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostLike(1, true)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Suka diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikeActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostLike(1, false)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Status suka berhasil diperbarui!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockRejectedValue(new Error("Gagal suka"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostLike(1, true)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal suka");
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikeActionCreator(true));
    });
  });

  describe("asyncSetIsPostAddComment", () => {
    it("should add comment, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockResolvedValue("Komentar ditambahkan");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostAddComment(1, "Halo")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Komentar ditambahkan");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddCommentActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostAddComment(1, "Halo")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Komentar berhasil ditambahkan!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockRejectedValue(new Error("Gagal komentar"));
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostAddComment(1, "Halo")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal komentar");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddCommentActionCreator(true));
    });
  });

  describe("asyncSetIsPostDeleteComment", () => {
    it("should delete comment, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockResolvedValue("Komentar dihapus");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteComment(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Komentar dihapus");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedCommentActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteCommentActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteComment(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Komentar berhasil dihapus!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockRejectedValue(
        new Error("Gagal hapus komentar")
      );
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteComment(1)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal hapus komentar");
      expect(dispatch).toHaveBeenCalledWith(
        setIsPostDeletedCommentActionCreator(false)
      );
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteCommentActionCreator(true));
    });
  });

  describe("asyncSetIsPostDeleteAll", () => {
    it("should delete all posts, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValue("Semua dihapus");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteAll()(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Semua dihapus");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteAllActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValue("");
      const successSpy = vi
        .spyOn(toolsHelper, "showSuccessDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteAll()(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Semua postingan berhasil dihapus!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockRejectedValue(
        new Error("Gagal hapus semua")
      );
      const errorSpy = vi
        .spyOn(toolsHelper, "showErrorDialog")
        .mockImplementation(() => {});

      await asyncSetIsPostDeleteAll()(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal hapus semua");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteAllActionCreator(true));
    });
  });
});
