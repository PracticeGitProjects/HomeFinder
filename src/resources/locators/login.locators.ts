import { Page, Locator } from '@playwright/test';

export class LoginLocators {

    // readonly emailButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signUpLink: Locator;
    // readonly phoneButton: Locator;
    // readonly phoneInput: Locator;

    constructor(private page: Page) {

        // this.emailButton = page.getByRole('button', {name: 'Email'});

        this.emailInput = page.locator("input[type='email']");

        this.passwordInput = page.locator("input[type='password']");

        this.signInButton = page.getByRole('button', {name: 'Sign In'});

        this.forgotPasswordLink = page.getByRole('link', {name: 'Forgot password?'});

        this.signUpLink = page.getByRole('link', {name: /Sign up for free/i});

        // this.phoneButton = page.getByRole('button', {name: 'Phone'});

        //  this.phoneInput = page.locator("input[type='tel']");
    }
}