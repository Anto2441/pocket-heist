import AuthForm from "@/components/AuthForm"

export default function LoginPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <AuthForm
          title="Log in to Your Account"
          headingLevel="h1"
          buttonLabel="Log In"
          linkText="Don't have an account? Sign up"
          linkHref="/signup"
        />
      </div>
    </div>
  )
}
