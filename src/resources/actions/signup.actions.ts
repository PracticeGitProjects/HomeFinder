import { Page } from '@playwright/test';
import { SignupLocators } from '../locators/signup.locator';

export class SignUpActions {

    private readonly locators: SignupLocators;

    constructor(private page: Page) {
        this.locators = new SignupLocators(page);
    }

    //Entering Signup details

    async clickEmailButton() {
        await this.locators.signupButton.click();
    }

    async verifyCreateAccountHeaderPresent() {
        await this.locators.createAccountHeader.isVisible();
    }

    async verifyCreateAccountHeaderText() {
        const createAccountHeaderText = await this.locators.createAccountHeader.innerText();
        return createAccountHeaderText;
    }

    async enterFullName(fullName: string) {
        await this.locators.fullNameInput.fill(fullName);
    }

    async enterEmailAddress(email: string) {
        await this.locators.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.locators.paswordInput.fill(password);
    }

    async verifyTermsOfServiceLinkPresent() {
        await this.locators.termsServiceLink.isVisible();
    }

    async clickTermsOfServiceCheckbox() {
        await this.locators.termsButton.check();
    }

    async clickContinueButton() {
        await this.locators.continueButton.click();
    }

}