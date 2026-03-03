"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import styles from "./AuthForm.module.css"

interface AuthFormProps {
  title: string
  headingLevel: "h1" | "h2"
  buttonLabel: string
  linkText: string
  linkHref: string
}

export default function AuthForm({
  title,
  headingLevel,
  buttonLabel,
  linkText,
  linkHref,
}: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const Heading = headingLevel

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Heading className="form-title">{title}</Heading>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <div className={styles.passwordField}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className={styles.toggleButton}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button type="submit" className={styles.submitButton}>
        {buttonLabel}
      </button>

      <Link href={linkHref} className={styles.switchLink}>
        {linkText}
      </Link>
    </form>
  )
}
