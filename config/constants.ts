export const BASE_URL = process.env.BASE_URL || 'https://www.automationexercise.com';

export const TIMEOUTS = {
    global: parseInt(process.env.GLOBAL_TIMEOUT || '60000'),
    action: parseInt(process.env.ACTION_TIMEOUT || '15000'),
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
};

export const SELECTORS = {
    // Header selectors
    headerLogo: 'a[href="/"]',
    signupLoginLink: 'a[href="/login"]',
    cartLink: 'a[href="/view_cart"]',
    logoutLink: 'a[href="/logout"]',

    // Common buttons
    continueShoppingBtn: 'a.btn-primary:has-text("Continue Shopping")',
    checkoutBtn: 'a[href="/checkout"]:visible, button:has-text("Checkout")',

    // Cart
    cartBadge: '.cart_quantity',
};