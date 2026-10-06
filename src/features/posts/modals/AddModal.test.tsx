import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(<AddModal show={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("should show validation error if description is empty", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const form = screen.getByTestId("add-post-modal").querySelector("form");
    fireEvent.submit(form);

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsPostAdd and call onClose on successful add", () => {
    const asyncAddSpy = vi.spyOn(postAction, "asyncSetIsPostAdd").mockReturnValue(() => {});
    const onClose = vi.fn();

    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isPostAdd: false,
        isPostAdded: false,
      },
    });

    const descInput = screen.getByTestId("add-post-description-input");
    fireEvent.change(descInput, { target: { value: "Postingan baru saya" } });

    const form = screen.getByTestId("add-post-modal").querySelector("form");
    fireEvent.submit(form);

    expect(asyncAddSpy).toHaveBeenCalledWith("Postingan baru saya");

    // Simulate completion from store
    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isPostAdd: true,
        isPostAdded: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle isPostAdd true when isPostAdded is false", () => {
    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />, {
      preloadedState: {
        isPostAdd: true,
        isPostAdded: false,
      },
    });

    expect(screen.getByTestId("add-post-modal")).toBeInTheDocument();
  });

  it("should close modal when close or cancel button clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />);

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByTestId("cancel-add-modal-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
