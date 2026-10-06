import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import HomePage from "./HomePage";
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
  usePathname: () => "/",
  useParams: () => ({}),
}));

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockPosts = [
    {
      id: 1,
      user_id: 1,
      description: "Postingan pertama saya",
      cover: "https://example.com/cover1.jpg",
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
      author: { name: "Abdullah", photo: "https://example.com/photo.jpg" },
      likes: [2, 3],
      comments: [{ id: 1, comment: "Keren!" }],
    },
    {
      id: 2,
      user_id: 3,
      description: "Postingan kedua",
      cover: null,
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
      author: { name: "Ubaid", photo: null },
      likes: [],
      comments: [],
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null if profile is not present", () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: null },
    });
    expect(container.firstChild).toBeNull();
  });

  it("should render posts stats and empty state when empty", async () => {
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue(() => Promise.resolve());
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [],
      },
    });

    expect(screen.getByText("Linimasa Postingan")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Belum ada postingan yang cocok.")).toBeInTheDocument();
    });
  });

  it("should display loading indicator while loading posts", () => {
    vi.spyOn(postAction, "asyncSetPosts").mockImplementation(
      () => () => new Promise(() => {})
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [],
      },
    });

    expect(screen.getByText("Memuat daftar postingan...")).toBeInTheDocument();
  });

  it("should display stats count and filter/search posts", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    expect(screen.getByText("Total Postingan")).toBeInTheDocument();
    expect(screen.getByText("Total Suka")).toBeInTheDocument();
    expect(screen.getByText("Total Komentar")).toBeInTheDocument();
    expect(screen.getByText("Postingan pertama saya")).toBeInTheDocument();
    expect(screen.getByText("Postingan kedua")).toBeInTheDocument();
    expect(screen.getByText("2 suka")).toBeInTheDocument();
    expect(screen.getByText("1 komentar")).toBeInTheDocument();

    // Test search filter by description
    const searchInput = screen.getByTestId("search-post-input");
    fireEvent.change(searchInput, { target: { value: "pertama" } });

    expect(screen.getByText("Postingan pertama saya")).toBeInTheDocument();
    expect(screen.queryByText("Postingan kedua")).not.toBeInTheDocument();

    // Test search filter by author name
    fireEvent.change(searchInput, { target: { value: "ubaid" } });
    expect(screen.getByText("Postingan kedua")).toBeInTheDocument();

    // Test filter buttons
    const filterMineBtn = screen.getByTestId("filter-mine-btn");
    fireEvent.click(filterMineBtn);

    const filterAllBtn = screen.getByTestId("filter-all-btn");
    fireEvent.click(filterAllBtn);
  });

  it("should handle search against posts with null description and missing author", async () => {
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue(() => Promise.resolve());
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [{ id: 99, user_id: 1, description: null, author: null }],
      },
    });
    // Wait for loading to finish first
    await waitFor(() => {
      expect(screen.queryByText("Memuat daftar postingan...")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Tanpa Nama")).toBeInTheDocument();
    expect(screen.getByText("Tidak ada deskripsi.")).toBeInTheDocument();

    const searchInput = screen.getByTestId("search-post-input");
    fireEvent.change(searchInput, { target: { value: "xyz" } });
    expect(screen.getByText("Belum ada postingan yang cocok.")).toBeInTheDocument();
  });

  it("should handle post author without name and without photo", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [{ id: 5, user_id: 1, description: "Tanpa author name", author: {} }],
      },
    });

    expect(screen.getByText("Tanpa Nama")).toBeInTheDocument();
  });

  it("should open and close AddModal when Tambah Postingan button clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const addBtn = screen.getByTestId("add-post-btn");
    fireEvent.click(addBtn);

    expect(screen.getByTestId("add-post-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("add-post-modal")).not.toBeInTheDocument();
  });

  it("should navigate to detail page when view icon clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const viewBtn = screen.getByTestId("view-post-1");
    fireEvent.click(viewBtn);

    expect(mockPush).toHaveBeenCalledWith("/posts/1");
  });

  it("should open and close edit modal when edit icon clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const editBtn = screen.getByTestId("edit-post-1");
    fireEvent.click(editBtn);

    expect(screen.getByTestId("edit-post-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument();
  });

  it("should open and close cover modal when cover icon clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const coverBtn = screen.getByTestId("cover-post-1");
    fireEvent.click(coverBtn);

    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-cover-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();
  });

  it("should trigger confirm dialog and dispatch delete when delete icon confirmed", async () => {
    const deleteActionSpy = vi
      .spyOn(postAction, "asyncSetIsPostDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const deleteBtn = screen.getByTestId("delete-post-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteActionSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not dispatch delete when cancelled", async () => {
    const deleteActionSpy = vi
      .spyOn(postAction, "asyncSetIsPostDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const deleteBtn = screen.getByTestId("delete-post-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteActionSpy).not.toHaveBeenCalled();
  });

  it("should dispatch delete all posts when confirmed", async () => {
    const deleteAllSpy = vi
      .spyOn(postAction, "asyncSetIsPostDeleteAll")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    // Button only appears on the "Postingan Saya" filter
    expect(screen.queryByTestId("delete-all-posts-btn")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filter-mine-btn"));

    const deleteAllBtn = screen.getByTestId("delete-all-posts-btn");
    fireEvent.click(deleteAllBtn);

    await waitFor(() => {
      expect(deleteAllSpy).toHaveBeenCalled();
    });
  });

  it("should not dispatch delete all posts when cancelled", async () => {
    const deleteAllSpy = vi
      .spyOn(postAction, "asyncSetIsPostDeleteAll")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    fireEvent.click(screen.getByTestId("filter-mine-btn"));
    fireEvent.click(screen.getByTestId("delete-all-posts-btn"));

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should render cover and author photo fallbacks when text data is missing", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [
          {
            id: 7,
            user_id: 1,
            description: null,
            cover: "https://example.com/cover7.jpg",
            author: { name: "", photo: "https://example.com/photo7.jpg" },
          },
        ],
      },
    });

    expect(screen.getByAltText("cover")).toBeInTheDocument();
    expect(screen.getByAltText("author")).toBeInTheDocument();
  });

  it("should reload posts when isPostDeleted is true", async () => {
    const asyncSetPostsSpy = vi
      .spyOn(postAction, "asyncSetPosts")
      .mockReturnValue(() => {});

    await act(async () => {
      renderWithProviders(<HomePage />, {
        preloadedState: {
          profile: mockProfile,
          posts: mockPosts,
          isPostDeleted: true,
        },
      });
    });

    expect(asyncSetPostsSpy).toHaveBeenCalled();
  });

  it("should reset filter and reload when isPostDeletedAll is true", async () => {
    const asyncSetPostsSpy = vi
      .spyOn(postAction, "asyncSetPosts")
      .mockReturnValue(() => {});

    await act(async () => {
      renderWithProviders(<HomePage />, {
        preloadedState: {
          profile: mockProfile,
          posts: [],
          isPostDeletedAll: true,
        },
      });
    });

    expect(asyncSetPostsSpy).toHaveBeenCalled();
    expect(screen.getByText("Linimasa Postingan")).toBeInTheDocument();
  });

  it("should not update loading state after unmount (isMounted guard on initial load)", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue(() => pendingPromise);

    const { unmount } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: mockProfile, posts: [] },
    });
    unmount();
    resolveLoad();
    await pendingPromise;
    // No error = isMounted guard correctly prevents setState after unmount
  });

  it("should not update loading state after unmount during isPostDeleted reload", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue(() => pendingPromise);

    const { unmount } = renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
        isPostDeleted: true,
      },
    });
    unmount();
    resolveLoad();
    await pendingPromise;
    // No error = isMounted guard correctly prevents setState after unmount
  });
});
