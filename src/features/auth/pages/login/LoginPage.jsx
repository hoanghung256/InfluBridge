import { SignIn } from "@clerk/clerk-react";

function LoginPage() {
    return <SignIn fallbackRedirectUrl="/login-callback" forceRedirectUrl="/login-callback" />;
}

export default LoginPage;
