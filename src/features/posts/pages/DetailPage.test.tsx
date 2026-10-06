import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/posts/1",
  useParams: () => ({ postId: "1" }),
}));

describe("DetailPage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockPost = {
    id: 1,
    user_id: 1,
    description: "Detail postingan saya",
    cover: "https://example.com/cover.jpg",
    created_at: "2024-02-26T02:34:26.000000Z",
    updated_at: "2024-02-26T02:44:47.000000Z",
    author: { name: "Abdullah", photo: "https://example.com/photo.jpg" },
    likes: [1, 2],
    comments: [{ id: 1, comment: "Komentar saya", created_at: "2024-02-26T02:34:26.000000Z" }],
    my_comment: { id: 1, comment: "Komentar saya" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner if profile or post is missing", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: null,
        post: null,
      },
    });

    expect(screen.queryByText("Detail postingan saya")).not.toBeInTheDocument();
  });

  it("should render loading spinner when profile exists but post is missing", () => {
    const { container } = renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: null,
      },
    });

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render post details correctly and support closing cover & edit modals", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    expect(screen.getByText("Detail postingan saya")).toBeInTheDocument();
    expect(screen.getByText("Abdullah")).toBeInTheDocument();
    expect(screen.getByText("Komentar saya")).toBeInTheDocument();
    expect(screen.getByTestId("like-post-btn")).toBeInTheDocument();

    // Open & close cover modal
    const editCoverBtn = screen.getByTestId("edit-cover-btn");
    fireEvent.click(editCoverBtn);
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();

    // Open & close edit modal
    const editDetailBtn = screen.getByTestId("edit-detail-post-btn");
    fireEvent.click(editDetailBtn);
    expect(screen.getByTestId("edit-post-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument();
  });

  it("should hide owner actions, cover and description for other users post", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: {
          id: 2,
          user_id: 9,
          description: "",
          cover: null,
          author: { name: "", photo: null },
          likes: [],
          comments: [],
          my_comment: null,
        },
      },
    });

    expect(screen.queryByTestId("edit-cover-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-detail-post-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-detail-post-btn")).not.toBeInTheDocument();
    expect(
      screen.getByText("Tidak ada deskripsi rinci untuk postingan ini.")
    ).toBeInTheDocument();
    expect(screen.getByText("Tanpa Nama")).toBeInTheDocument();
    expect(screen.getByText("Belum ada komentar pada postingan ini.")).toBeInTheDocument();
  });

  it("should render unlike state and missing likes/comments data", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: {
          id: 3,
          user_id: 1,
          description: "Tanpa suka",
          author: { name: "Ubaid", photo: null },
        },
      },
    });

    expect(screen.getByText("Tanpa suka")).toBeInTheDocument();
    expect(screen.getByTestId("like-post-btn")).toBeInTheDocument();
  });

  it("should render cover and author photo with fallback alt text", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: {
          id: 8,
          user_id: 1,
          description: null,
          cover: "https://example.com/cover8.jpg",
          author: { name: "", photo: "https://example.com/photo8.jpg" },
          likes: [],
          comments: [],
        },
      },
    });

    expect(screen.getByAltText("cover")).toBeInTheDocument();
    expect(screen.getByAltText("author")).toBeInTheDocument();
    expect(
      screen.getByText("Tidak ada deskripsi rinci untuk postingan ini.")
    ).toBeInTheDocument();
  });

  it("should dispatch like action when like button clicked", async () => {
    const likeSpy = vi
      .spyOn(postAction, "asyncSetIsPostLike")
      .mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    // mockPost.likes contains profile.id => unlike
    fireEvent.click(screen.getByTestId("like-post-btn"));

    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith(1, false);
    });
  });

  it("should dispatch like action for a post that is not liked yet", async () => {
    const likeSpy = vi
      .spyOn(postAction, "asyncSetIsPostLike")
      .mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: { ...mockPost, likes: [7] },
      },
    });

    fireEvent.click(screen.getByTestId("like-post-btn"));

    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith(1, true);
    });
  });

  it("should dispatch add comment and ignore empty comment", async () => {
    const commentSpy = vi
      .spyOn(postAction, "asyncSetIsPostAddComment")
      .mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const form = screen.getByTestId("comment-input").closest("form");

    // Empty comment should be ignored
    fireEvent.submit(form);
    expect(commentSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "Komentar baru" },
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(commentSpy).toHaveBeenCalledWith(1, "Komentar baru");
    });
  });

  it("should dispatch delete comment when confirmed", async () => {
    const deleteCommentSpy = vi
      .spyOn(postAction, "asyncSetIsPostDeleteComment")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    fireEvent.click(screen.getByTestId("delete-comment-1"));

    await waitFor(() => {
      expect(deleteCommentSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not dispatch delete comment when cancelled", async () => {
    const deleteCommentSpy = vi
      .spyOn(postAction, "asyncSetIsPostDeleteComment")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: {
          ...mockPost,
          comments: [
            { id: 1, comment: "Komentar saya" },
            { id: 2, comment: "Komentar orang lain" },
          ],
        },
      },
    });

    fireEvent.click(screen.getByTestId("delete-comment-1"));

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteCommentSpy).not.toHaveBeenCalled();
    // Comment from another user has no delete button
    expect(screen.queryByTestId("delete-comment-2")).not.toBeInTheDocument();
  });

  it("should trigger confirm dialog and dispatch delete on delete button click when confirmed", async () => {
    const deleteSpy = vi
      .spyOn(postAction, "asyncSetIsPostDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const deleteBtn = screen.getByTestId("delete-detail-post-btn");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not dispatch delete when cancelled", async () => {
    const deleteSpy = vi
      .spyOn(postAction, "asyncSetIsPostDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const deleteBtn = screen.getByTestId("delete-detail-post-btn");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should navigate back to home if isPost is true and post is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: null,
        isPost: true,
      },
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should stay when isPost is true and post exists", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPost: true,
      },
    });

    expect(screen.getByText("Detail postingan saya")).toBeInTheDocument();
  });

  it("should navigate back to home if isPostDeleted is true", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostDeleted: true,
      },
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should refresh post when isPostLiked is true", async () => {
    const setPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostLiked: true,
      },
    });

    await waitFor(() => {
      expect(setPostSpy).toHaveBeenCalledWith("1");
    });
  });

  it("should refresh post when isPostAddedComment is true", async () => {
    const setPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostAddedComment: true,
      },
    });

    await waitFor(() => {
      expect(setPostSpy).toHaveBeenCalledWith("1");
    });
  });

  it("should refresh post when isPostDeletedComment is true", async () => {
    const setPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue(() => {});

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostDeletedComment: true,
      },
    });

    await waitFor(() => {
      expect(setPostSpy).toHaveBeenCalledWith("1");
    });
  });
});
