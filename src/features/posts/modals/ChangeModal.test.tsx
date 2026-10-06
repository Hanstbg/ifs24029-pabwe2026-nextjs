import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

describe("ChangeModal", () => {
  const mockPost = {
    id: 1,
    description: "Deskripsi Awal",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal show={false} onClose={vi.fn()} postId={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should populate textarea with post data and handle changes", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    const descInput = screen.getByTestId("edit-post-description-input");
    expect(descInput.value).toBe("Deskripsi Awal");

    fireEvent.change(descInput, { target: { value: "Deskripsi Baru" } });
    expect(descInput.value).toBe("Deskripsi Baru");
  });

  it("should handle empty description in post object", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: { id: 1, description: null },
      },
    });

    expect(screen.getByTestId("edit-post-description-input").value).toBe("");
  });

  it("should validate empty description", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    const descInput = screen.getByTestId("edit-post-description-input");
    const form = descInput.closest("form");

    fireEvent.change(descInput, { target: { value: "   " } });
    fireEvent.submit(form);
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsPostChange and close on success", () => {
    const changeSpy = vi.spyOn(postAction, "asyncSetIsPostChange").mockReturnValue(() => {});
    const onClose = vi.fn();

    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: false,
        isPostChanged: false,
      },
    });

    const form = screen.getByTestId("edit-post-description-input").closest("form");
    fireEvent.submit(form);

    expect(changeSpy).toHaveBeenCalledWith(1, "Deskripsi Awal");

    // Simulate completion with isPostChanged true
    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: true,
        isPostChanged: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle isPostChange true when isPostChanged is false", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: true,
        isPostChanged: false,
      },
    });

    expect(screen.getByTestId("edit-post-description-input")).toBeInTheDocument();
  });

  it("should not fetch detail when postId is missing", () => {
    const setPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue(() => {});

    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={undefined} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    expect(setPostSpy).not.toHaveBeenCalled();
  });

  it("should trigger onClose on cancel or close button click", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("cancel-edit-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
