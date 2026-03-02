import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("displays first letter for a regular name", () => {
    render(<Avatar name="bob" />)
    expect(screen.getByText("B")).toBeInTheDocument()
  })

  it("displays first two uppercase letters for a PascalCase name", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })
})
