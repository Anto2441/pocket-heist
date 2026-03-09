import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { User } from "firebase/auth";

import { useUser } from "@/hooks/useUser";
import PublicLayout from "@/app/(public)/layout";

vi.mock("@/hooks/useUser");
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("@/lib/firebase", () => ({ auth: {} }));

import { useRouter } from "next/navigation";

describe("PublicLayout", () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ replace: mockReplace } as never);
    mockReplace.mockReset();
  });

  it("renders children when unauthenticated", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
    render(<PublicLayout>Page content</PublicLayout>);

    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("shows spinner (not children) while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    render(<PublicLayout>Page content</PublicLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Page content")).not.toBeInTheDocument();
  });

  it("redirects to /heists and shows spinner when authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as User,
      loading: false,
    });
    render(<PublicLayout>Page content</PublicLayout>);

    expect(mockReplace).toHaveBeenCalledWith("/heists");
    expect(screen.queryByText("Page content")).not.toBeInTheDocument();
  });
});
