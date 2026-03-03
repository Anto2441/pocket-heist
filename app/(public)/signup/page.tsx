import AuthForm from "@/components/AuthForm"

export default function SignupPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <AuthForm
          title="Signup for an Account"
          headingLevel="h2"
          buttonLabel="Sign Up"
          linkText="Already have an account? Log in"
          linkHref="/login"
        />
      </div>
    </div>
  )
}
