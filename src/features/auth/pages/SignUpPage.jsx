import { SignIn } from "@clerk/clerk-react";

function SignUpPage() {
    return <SignIn forceRedirectUrl="/login-callback" fallbackRedirectUrl="/login-callback" />;
}

export default SignUpPage;
