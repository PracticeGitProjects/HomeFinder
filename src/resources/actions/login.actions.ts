import { Page } from '@playwright/test';
import { LoginLocators } from '../locators/login.locators';

export class LoginActions {

    private readonly locators: LoginLocators;

    constructor(private page: Page) {
        this.locators = new LoginLocators(page);
    }

    //Entering login details using email address and password
    // async clickEmailButton() {
    //     await this.locators.emailButton.click();
    // }

    async enterEmail(email: string) {
        await this.locators.emailInput.fill(email);
    }

    async enterEmailPassword(password: string) {
        await this.locators.passwordInput.fill(password);
    }

    async clickSignInButton() {
        await this.locators.signInButton.click();
    }

    // //Entering login details using phone number and password
    // async clickPhoneButton() {
    //     await this.locators.phoneButton.click();
    // }

    // async enterPhoneNumber(phoneNumber: string) {   
    //     await this.locators.phoneInput.fill(phoneNumber);
    // }

    // async enterPhonePassword (password: string) {
    //     await this.locators.passwordInput.fill(password);
    // }

}