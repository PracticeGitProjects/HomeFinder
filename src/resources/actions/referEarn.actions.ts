import { Page } from '@playwright/test';
import { ReferEarnLocators } from '../locators/referEarn.locators';

export class ReferEarnActions {

    private readonly locators: ReferEarnLocators;

    constructor(private page: Page) {
        this.locators = new ReferEarnLocators(page);
    }

    async clickReferEarnTab() {
        await this.locators.homepageReferEarnTab.click();
    }

    async enterCity(city: string) {
        await this.locators.referEarnCityInput.fill(city);
    }

    async clickReferButton() {
        await this.locators.homepageReferButton.click();
    }

    get basicPropertyDetailsHeader() {
        return this.locators.basicPropertyDetailsHeader;
    }


}