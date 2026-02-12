// EMERGENCY CLEAR UTILITY
// Use this if localStorage won't clear normally

// Method 1: Call this function from browser console
window.emergencyClear = function () {
    console.log('🔴 EMERGENCY CLEAR INITIATED...');

    // Stop all timers
    for (let i = 0; i < 10000; i++) {
        clearInterval(i);
        clearTimeout(i);
    }

    // Clear all localStorage
    localStorage.clear();

    // Clear all sessionStorage
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('✅ All storage cleared!');
    console.log('🔄 Reloading page in 1 second...');

    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Method 2: Keyboard shortcut (Ctrl + Shift + Delete)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        if (confirm('🔴 EMERGENCY CLEAR?\n\nThis will:\n• Clear ALL localStorage\n• Clear ALL sessionStorage\n• Clear ALL cookies\n• Reload the page\n\nContinue?')) {
            window.emergencyClear();
        }
    }
});

console.log('🚨 Emergency Clear Utility Loaded!');
console.log('📌 Method 1: Type "emergencyClear()" in console');
console.log('⌨️  Method 2: Press Ctrl + Shift + Delete');
