import { describe, it, expect, vi, beforeEach } from "vitest";
import postApi from "./postApi";
import apiHelper from "../../../helpers/apiHelper";

describe("postApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postPost", () => {
    it("should create new post and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { post_id: 10 },
        }),
      });

      const res = await postApi.postPost("Description");
      expect(res).toEqual({ post_id: 10 });
    });

    it("should return data when response only provides success flag", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          success: true,
          data: { post_id: 11 },
        }),
      });

      const res = await postApi.postPost("Description");
      expect(res).toEqual({ post_id: 11 });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(postApi.postPost("")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.postPost("")).rejects.toThrow(
        "Gagal menambahkan postingan"
      );
    });
  });

  describe("postPostCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await postApi.postPostCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await postApi.postPostCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putPost", () => {
    it("should update post and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await postApi.putPost(1, "Updated");
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update postingan",
        }),
      });

      await expect(postApi.putPost(1, "")).rejects.toThrow("Gagal update postingan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.putPost(1, "")).rejects.toThrow(
        "Gagal mengubah postingan"
      );
    });
  });

  describe("getPosts", () => {
    it("should fetch all posts without filter", async () => {
      const mockPosts = [{ id: 1, description: "Post 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { posts: mockPosts },
        }),
      });

      const posts = await postApi.getPosts();
      expect(posts).toEqual(mockPosts);
    });

    it("should fetch only own posts when is_me parameter provided", async () => {
      const mockPosts = [{ id: 2, description: "Post 2", user_id: 1 }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { posts: mockPosts },
        }),
      });

      const posts = await postApi.getPosts("1");
      expect(posts).toEqual(mockPosts);
    });

    it("should return empty array if data.posts is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const posts = await postApi.getPosts();
      expect(posts).toEqual([]);
    });

    it("should throw error on fetch posts fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses tidak diizinkan",
        }),
      });

      await expect(postApi.getPosts()).rejects.toThrow("Akses tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.getPosts()).rejects.toThrow(
        "Gagal mengambil data postingan"
      );
    });
  });

  describe("getPostById", () => {
    it("should return single post object on success", async () => {
      const mockPost = { id: 5, description: "Single" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { post: mockPost },
        }),
      });

      const res = await postApi.getPostById(5);
      expect(res).toEqual(mockPost);
    });

    it("should throw error on detail fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Postingan tidak ditemukan",
        }),
      });

      await expect(postApi.getPostById(999)).rejects.toThrow(
        "Postingan tidak ditemukan"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.getPostById(999)).rejects.toThrow(
        "Gagal mengambil detail postingan"
      );
    });
  });

  describe("deletePost", () => {
    it("should delete post and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await postApi.deletePost(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      });

      await expect(postApi.deletePost(1)).rejects.toThrow("Gagal menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.deletePost(1)).rejects.toThrow(
        "Gagal menghapus postingan"
      );
    });
  });

  describe("postLike", () => {
    it("should give like when like flag is true", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah status suka pada postingan",
        }),
      });

      const msg = await postApi.postLike(1, true);
      expect(msg).toBe("Berhasil mengubah status suka pada postingan");
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/posts/1/likes"),
        expect.objectContaining({ body: JSON.stringify({ like: 1 }) })
      );
    });

    it("should remove like when like flag is false", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah status suka pada postingan",
        }),
      });

      const msg = await postApi.postLike(1, false);
      expect(msg).toBe("Berhasil mengubah status suka pada postingan");
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/posts/1/likes"),
        expect.objectContaining({ body: JSON.stringify({ like: 0 }) })
      );
    });

    it("should throw error on like fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menyukai",
        }),
      });

      await expect(postApi.postLike(1, true)).rejects.toThrow("Gagal menyukai");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.postLike(1, true)).rejects.toThrow(
        "Gagal mengubah status suka"
      );
    });
  });

  describe("postComment", () => {
    it("should add comment and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil memberikan komentar pada postingan",
        }),
      });

      const msg = await postApi.postComment(1, "Komentar percobaan");
      expect(msg).toBe("Berhasil memberikan komentar pada postingan");
    });

    it("should throw error on comment fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Komentar kosong",
        }),
      });

      await expect(postApi.postComment(1, "")).rejects.toThrow("Komentar kosong");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.postComment(1, "")).rejects.toThrow(
        "Gagal menambahkan komentar"
      );
    });
  });

  describe("deleteComment", () => {
    it("should delete comment and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus komentar pada postingan",
        }),
      });

      const msg = await postApi.deleteComment(1);
      expect(msg).toBe("Berhasil menghapus komentar pada postingan");
    });

    it("should throw error on delete comment fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Komentar tidak ditemukan",
        }),
      });

      await expect(postApi.deleteComment(1)).rejects.toThrow(
        "Komentar tidak ditemukan"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.deleteComment(1)).rejects.toThrow(
        "Gagal menghapus komentar"
      );
    });
  });

  describe("deleteAllPosts", () => {
    it("should delete all posts and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus semua data postingan",
        }),
      });

      const msg = await postApi.deleteAllPosts();
      expect(msg).toBe("Berhasil menghapus semua data postingan");
    });

    it("should throw error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthenticated.",
        }),
      });

      await expect(postApi.deleteAllPosts()).rejects.toThrow("Unauthenticated.");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.deleteAllPosts()).rejects.toThrow(
        "Gagal menghapus semua postingan"
      );
    });
  });
});
