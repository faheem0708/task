export function AuthErrorMessage(code: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "This email is already registered.";
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password.";
        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";
        case "auth/invalid-credential":
            return "Invalid Credentials"
        default:
            return "Something Went Wrong";
    }
}
