import { LoginForm } from "./LoginForm";
export default function LoginPage() {
  return (
   <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-cover bg-center" style={{ backgroundImage: "url('/Group 117.jpg')" }}>
  {/* Optional overlay for readability */}
  <div className="absolute inset-0 bg-black/60 z-0" />

  {/* Centered Login Form */}
  <div className="relative z-10 w-full max-w-sm">
    <LoginForm />
  </div>
</div>

  )
}