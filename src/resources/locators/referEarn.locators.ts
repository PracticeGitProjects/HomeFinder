import { Page, Locator } from '@playwright/test';

export class ReferEarnLocators {
    readonly homepageReferEarnTab: Locator;
    readonly referEarnCityInput: Locator;
    readonly homepageReferButton: Locator;
    readonly basicPropertyDetailsHeader: Locator;




    constructor(private page: Page) {
        this.homepageReferEarnTab = page.locator("span:has-text('Refer & Earn')");

        this.referEarnCityInput = page.locator("(//span[text()='Refer']/ancestor::div)[6]//input");

        this.homepageReferButton = page.locator("//span[text()='Refer']/../..//button");

        this.basicPropertyDetailsHeader = page.getByRole('heading', { name: 'Basic Property Details' });

    }



}