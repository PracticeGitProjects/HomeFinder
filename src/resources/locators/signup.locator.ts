import { Page, Locator } from '@playwright/test';

export class SignupLocators {

    readonly signupButton: Locator;
    readonly createAccountHeader: Locator;
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly paswordInput: Locator;
    readonly termsServiceLink: Locator;
    readonly termsButton: Locator;
    readonly continueButton: Locator;

    constructor(private page: Page) {

        this.signupButton = page.getByRole('link', { name: 'Sign Up' });

        this.createAccountHeader = page.getByRole('heading', { name: 'Create Your Account' });

        this.fullNameInput = page.getByPlaceholder('Enter your full name');

        this.emailInput = page.getByPlaceholder('Enter your email');

        this.phoneInput = page.getByPlaceholder('10-digit mobile number');

        this.paswordInput = page.locator('input#password');

        this.termsServiceLink = page.getByRole('link', { name: 'Terms of Service' });

        this.termsButton = page.locator('button#terms');

        this.continueButton=page.getByRole('button', { name: 'Continue' });

    }
}