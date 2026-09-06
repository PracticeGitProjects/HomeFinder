import { ReferEarnLocatorsEndToEnd } from '../locators/referEarnEndToEnd.locators';
import { ExcelUtils } from '../utils/excel.utils';
import { SliderUtils } from '../utils/slider.utils';
import { Page } from '@playwright/test';

export class ReferEarnActionsEndToEnd {

    private readonly locators: ReferEarnLocatorsEndToEnd;
    private readonly testData: Record<string, any>;

    constructor(
        private page: Page,
        testCaseName: string
    ) {
        this.locators =
            new ReferEarnLocatorsEndToEnd(page);

        /*
         * Fetch testcase data from Excel.
         *
         * Sheet name  : Refer
         * Testcase ID : passed from testcase
         */
        this.testData =
            ExcelUtils.getTestData(
                'Refer',
                testCaseName
            );
    }

    // ==========================================
    // Refer & Earn
    // ==========================================

    async clickReferEarnTab() {

        await this.locators.homepageReferEarnTab.click();
    }

    async enterCity() {

        await this.locators.referEarnCityInput.fill(
            this.testData.city
        );
    }

    async clickReferButton() {

        await this.locators.homepageReferButton.click();
    }

    get basicPropertyDetailsHeader() {

        return this.locators.basicPropertyDetailsHeader;
    }

    // ==========================================
    // Basic Property Details
    // ==========================================

    async selectCity() {

        await this.locators.cityDropdownList.selectOption({
            label: this.testData.city
        });
    }

    async addLocality() {

        await this.locators.localityInput.fill(
            this.testData.locality
        );
    }

    async clickLocalityFirstOption() {

        await this.locators.localityFirstOption.click();
    }

    async selectRelationshipWithProperty() {

        const relationship =
            this.testData.relationship_with_property;

        await this.locators.relationshipWithPropertyOptions
            .filter({
                hasText: relationship
            })
            .locator('button')
            .click();
    }

    async selectListingType() {

        const listingType =
            String(this.testData.listing_type).trim();

        if (!listingType) {

            throw new Error(
                'Listing Type is missing in Excel'
            );
        }

        await this.locators
            .listingTypeOption(listingType)
            .click();
    }

    async selectPreferredTenants() {

        const preferredTenants =
            this.testData.preferred_tenants;

        await this.locators.preferedTenantsOptions
            .filter({
                hasText: preferredTenants
            })
            .locator('button')
            .click();
    }

    async selectMonthlyRent() {

        const rent =
            Number(
                String(this.testData.monthly_rent)
                    .replace(/,/g, '')
                    .trim()
            );

        if (Number.isNaN(rent)) {

            throw new Error(
                `Invalid monthly rent in Excel: ${this.testData.monthly_rent}`
            );
        }

        await SliderUtils.setSliderValue(
            this.locators.monthlyRentSlider,
            this.locators.monthlyRentDisplayedValue,
            rent
        );
    }

    async selectSecurityDeposit() {

        const depositValue =
            this.testData.security_deposit;

        const deposit =
            Number(
                String(depositValue)
                    .replace(/,/g, '')
                    .trim()
            );

        if (Number.isNaN(deposit)) {

            throw new Error(
                `Invalid security deposit: ${depositValue}`
            );
        }

        await SliderUtils.setSliderValue(
            this.locators.securityDepositSlider,
            this.locators.securityDepositDisplayedValue,
            deposit
        );
    }

    async selectBhkType() {

        const bhkType =
            this.testData.bhk_type;

        await this.locators.bhkTypeOptions
            .filter({
                hasText: bhkType
            })
            .locator('button')
            .click();
    }

    async selectFurnishing() {

        const furnishing =
            this.testData.furnishing;

        await this.locators.furninshingOptions
            .filter({
                hasText: furnishing
            })
            .locator('button')
            .click();
    }

    async selectPropertyType() {

        const propertyType =
            this.testData.property_type;

        await this.locators.propertyTypeOptions
            .filter({
                hasText: propertyType
            })
            .locator('button')
            .click();
    }

    async addStreetAddress() {

        await this.locators.streetAddressInput.fill(
            this.testData.street_address
        );
    }

    async addBuildingDetails() {

        await this.locators.buildingDeatailsInput.fill(
            this.testData.building_details
        );
    }

    async addLandmark() {

        await this.locators.landmarkInput.fill(
            this.testData.landmark
        );
    }

    // ==========================================
    // Basic Property Details Buttons
    // ==========================================

    async clickBasicContinue() {

        await this.locators.basicContinueButton.click();
    }

    async clickBasicCancel() {

        await this.locators.basicCancelButton.click();
    }

    // ==========================================
    // Additional Property Details
    // ==========================================

    async selectParking() {

        const parking =
            this.testData.parking;

        await this.locators.parkingOptions
            .filter({
                hasText: parking
            })
            .locator('button')
            .click();
    }

    async selectAmenities() {

        const amenities =
            String(this.testData.amenities)
                .split(',')
                .map(value => value.trim())
                .filter(Boolean);

        for (const amenity of amenities) {

            await this.locators.amenitiesOptions
                .filter({
                    hasText: amenity
                })
                .locator('button')
                .click();
        }
    }

    async selectDietPreference() {

        const dietPreference =
            this.testData.diet_preference;

        await this.locators.dietPrefrenceOptions
            .filter({
                hasText: dietPreference
            })
            .locator('button')
            .click();
    }

    async selectPetPreference() {

        const petPreference =
            this.testData.pet_preference;

        await this.locators.petPreferenceOptions
            .filter({
                hasText: petPreference
            })
            .locator('button')
            .click();
    }

    async selectBuiltUpArea() {

        const builtUpArea =
            Number(
                String(this.testData.built_up_area)
                    .replace(/,/g, '')
                    .trim()
            );

        if (Number.isNaN(builtUpArea)) {

            throw new Error(
                `Invalid built up area in Excel: ${this.testData.built_up_area}`
            );
        }

        await SliderUtils.setSliderValueByAria(
            this.locators.builtupAreaSlider,
            builtUpArea
        );
    }

    async selectFloor() {

        const floorValue =
            String(this.testData.floor).trim();

        if (!floorValue) {

            throw new Error(
                'Floor is missing in Excel'
            );
        }

        let floor: number;

        // Ground Floor = 0
        if (
            floorValue.toLowerCase() ===
            'ground floor'
        ) {

            floor = 0;

        } else {

            /*
             * Examples:
             *
             * 1st Floor  -> 1
             * 2nd Floor  -> 2
             * 3rd Floor  -> 3
             * 10th Floor -> 10
             */

            const match =
                floorValue.match(/^(\d+)/);

            if (!match) {

                throw new Error(
                    `Invalid floor in Excel: ${floorValue}`
                );
            }

            floor =
                Number(match[1]);
        }

        console.log(
            '=========================================='
        );

        console.log(
            'Excel Floor:',
            floorValue
        );

        console.log(
            'Target Floor Value:',
            floor
        );

        console.log(
            '=========================================='
        );

        await SliderUtils.setSliderValueByAria(
            this.locators.floorSlider,
            floor
        );
    }

    async selectAvailableFrom() {

        const availableFrom =
            this.testData.available_from;

        await this.locators.availableFromOptions
            .filter({
                hasText: availableFrom
            })
            .locator('button')
            .click();
    }

    async selectRentalAgreement() {

        const rentalAgreement =
            this.testData.rental_agreement;

        await this.locators.rentalAgreementOptions
            .filter({
                hasText: rentalAgreement
            })
            .locator('button')
            .click();
    }

    async selectNearbyLocality() {

        const nearbyLocality =
            this.testData.nearby_locality;

        await this.locators.nearbyLocalityOptions
            .filter({
                hasText: nearbyLocality
            })
            .locator('button')
            .click();
    }

    async addFeature() {

        const feature =
            this.testData.feature;

        await this.locators.addFeatureButton.click();

        await this.locators.featureInput.fill(
            feature
        );
    }

    async addDescription() {

        await this.locators.descriptionInput.fill(
            this.testData.description
        );
    }

    // ==========================================
    // Additional Property Details Buttons
    // ==========================================

    async clickAdditionalContinue() {

        await this.locators.additionalContinueButton.click();
    }

    async clickAdditionalCancel() {

        await this.locators.additionalCancelButton.click();
    }

    // ==========================================
    // Photos & Review
    // ==========================================

    async selectReferralReward() {

        const reward =
            this.testData.referral_reward;

        await this.locators.setRewardOptions
            .filter({
                hasText: reward
            })
            .click();
    }

    async selectPhotos() {

        await this.locators.setPhotos.click();
    }

    async selectVideo() {

        await this.locators.setVideo.click();
    }

    async acceptTerms() {

        await this.locators.termsButton.click();
    }

    async publishListing() {

        await this.locators.publishButton.click();
    }

    // ==========================================
    // Photos & Review Header
    // ==========================================

    get photosAndReeardsHeader() {

        return this.locators.photosAndReeardsHeader;
    }
}