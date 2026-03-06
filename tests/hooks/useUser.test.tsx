import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

// Mock lib/firebase
vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

import { onAuthStateChanged } from "firebase/auth";

const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);

beforeEach(() => {
  mockOnAuthStateChanged.mockReset();
  mockOnAuthStateChanged.mockReturnValue(vi.fn()); // default: unsubscribe noop
});

function TestComponent() {
  const { user, loading } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
    </div>
  );
}

describe("useUser", () => {
  it("returns loading=true and user=null before auth resolves", () => {
    // onAuthStateChanged never calls the callback
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("returns user object and loading=false when authenticated", () => {
    const mockUser = { email: "test@example.com", uid: "123" };

    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      // @ts-expect-error - partial User mock
      callback(mockUser);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("test@example.com");
  });

  it("returns user=null and loading=false when logged out", () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      // @ts-expect-error - null is a valid auth state
      callback(null);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("unsubscribes from auth listener on unmount", () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("throws an error when used outside AuthProvider", () => {
    // Suppress expected console.error from React
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useUser must be used within AuthProvider",
    );

    vi.mocked(console.error).mockRestore();
  });
});
