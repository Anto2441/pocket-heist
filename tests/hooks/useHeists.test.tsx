import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { useHeists } from "@/hooks/useHeists";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    onSnapshot: vi.fn(),
    collection: vi.fn(),
    query: vi.fn((...args) => args),
    where: vi.fn((...args) => args),
    Timestamp: { now: vi.fn(() => ({ seconds: 9999, nanoseconds: 0 })) },
  };
});

vi.mock("@/lib/firebase", () => ({ db: {} }));

const mockUnsubscribe = vi.fn();
const mockUser = { uid: "user-1" };

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(() => ({ user: mockUser, loading: false })),
}));

import { useUser } from "@/hooks/useUser";

const mockCollectionRef = { withConverter: vi.fn() };
const mockQuery = {};

beforeEach(() => {
  vi.mocked(onSnapshot).mockReset();
  vi.mocked(collection).mockReturnValue(mockCollectionRef as never);
  mockCollectionRef.withConverter.mockReturnValue(mockCollectionRef);
  vi.mocked(query).mockReturnValue(mockQuery as never);
  vi.mocked(where).mockImplementation((...args) => args as never);
  mockUnsubscribe.mockReset();
  vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
  vi.mocked(useUser).mockReturnValue({
    user: mockUser,
    loading: false,
  } as never);
});

describe("useHeists", () => {
  it("returns loading: true and heists: [] before snapshot fires", () => {
    vi.mocked(onSnapshot).mockImplementation(() => mockUnsubscribe); // never calls callback

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.loading).toBe(true);
    expect(result.current.heists).toEqual([]);
  });

  it("calls onSnapshot with the correct query for 'active' mode", () => {
    renderHook(() => useHeists("active"));

    expect(where).toHaveBeenCalledWith("assignedTo", "==", "user-1");
    expect(where).toHaveBeenCalledWith("deadline", ">", expect.anything());
    expect(onSnapshot).toHaveBeenCalledOnce();
  });

  it("calls onSnapshot with the correct query for 'assigned' mode", () => {
    renderHook(() => useHeists("assigned"));

    expect(where).toHaveBeenCalledWith("createdBy", "==", "user-1");
    expect(where).toHaveBeenCalledWith("deadline", ">", expect.anything());
    expect(onSnapshot).toHaveBeenCalledOnce();
  });

  it("calls onSnapshot with the correct query for 'expired' mode", () => {
    renderHook(() => useHeists("expired"));

    expect(where).toHaveBeenCalledWith("deadline", "<=", expect.anything());
    expect(onSnapshot).toHaveBeenCalledOnce();
  });

  it("returns heist data from the snapshot callback", () => {
    const mockHeist = { id: "h1", title: "Steal the Stapler" };

    vi.mocked(onSnapshot).mockImplementation((_q, callback) => {
      (callback as Function)({ docs: [{ data: () => mockHeist }] });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.heists).toEqual([mockHeist]);
    expect(result.current.loading).toBe(false);
  });

  it("does not call onSnapshot when user is null; returns loading: false and heists: []", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false } as never);

    const { result } = renderHook(() => useHeists("active"));

    expect(onSnapshot).not.toHaveBeenCalled();
    expect(result.current.heists).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("calls the unsubscribe function on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});
