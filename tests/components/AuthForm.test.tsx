import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import AuthForm from "@/components/AuthForm"

describe("AuthForm", () => {
  const loginProps = {
    title: "Log in to Your Account",
    headingLevel: "h1" as const,
    buttonLabel: "Log In",
    linkText: "Don't have an account? Sign up",
    linkHref: "/signup",
  }

  const signupProps = {
    title: "Signup for an Account",
    headingLevel: "h2" as const,
    buttonLabel: "Sign Up",
    linkText: "Already have an account? Log in",
    linkHref: "/login",
  }

  describe("Login variant", () => {
    it("renders email input, password input, and submit button", () => {
      render(<AuthForm {...loginProps} />)

      expect(screen.getByLabelText("Email")).toBeInTheDocument()
      expect(screen.getByLabelText("Password")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
    })

    it("renders the title as an h1", () => {
      render(<AuthForm {...loginProps} />)

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Log in to Your Account")
    })

    it("contains a link to the signup page", () => {
      render(<AuthForm {...loginProps} />)

      const link = screen.getByRole("link", { name: /sign up/i })
      expect(link).toHaveAttribute("href", "/signup")
    })
  })

  describe("Signup variant", () => {
    it("renders email input, password input, and submit button", () => {
      render(<AuthForm {...signupProps} />)

      expect(screen.getByLabelText("Email")).toBeInTheDocument()
      expect(screen.getByLabelText("Password")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
    })

    it("renders the title as an h2", () => {
      render(<AuthForm {...signupProps} />)

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Signup for an Account")
    })

    it("contains a link to the login page", () => {
      render(<AuthForm {...signupProps} />)

      const link = screen.getByRole("link", { name: /log in/i })
      expect(link).toHaveAttribute("href", "/login")
    })
  })

  describe("Behavior", () => {
    it("toggles password visibility when the toggle button is clicked", async () => {
      const user = userEvent.setup()
      render(<AuthForm {...loginProps} />)

      const passwordInput = screen.getByLabelText("Password")
      expect(passwordInput).toHaveAttribute("type", "password")

      const toggleButton = screen.getByRole("button", { name: /show password/i })
      await user.click(toggleButton)

      expect(passwordInput).toHaveAttribute("type", "text")

      await user.click(screen.getByRole("button", { name: /hide password/i }))
      expect(passwordInput).toHaveAttribute("type", "password")
    })

    it("logs email and password to console on submit", async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      render(<AuthForm {...loginProps} />)

      await user.type(screen.getByLabelText("Email"), "test@example.com")
      await user.type(screen.getByLabelText("Password"), "secret123")
      await user.click(screen.getByRole("button", { name: "Log In" }))

      expect(consoleSpy).toHaveBeenCalledWith({ email: "test@example.com", password: "secret123" })
      consoleSpy.mockRestore()
    })
  })
})
