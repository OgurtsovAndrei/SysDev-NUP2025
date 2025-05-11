function goToOrderPage() {
    console.log("Navigating to Order Page");
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "order.html";
}

function goToUsagePage() {
    console.log("Navigating to Usage Page");
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "usage.html";
}

function goToChatPage() {
    console.log("Navigating to Chat Page");
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "chat.html";
}

function goToFeedbackPage() {
    console.log("Navigating to Feedback Page");
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "feedback.html";
}

function goToProfilePage() {
    console.log("Navigating to Profile Page");
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "profile.html";
}

function goToLoginPage() {
    console.log("Navigating to Login/Logout Page");
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        console.log("User is logged in, redirecting to logout page");
        window.location.href = "logout.html";
    } else {
        console.log("User is not logged in, redirecting to login page");
        window.location.href = "login.html";
    }
}

function goToRegisterPage() {
    console.log("Navigating to Register Page");
    window.location.href = "register.html";
}
