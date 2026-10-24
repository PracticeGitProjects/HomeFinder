import { Page, Locator } from '@playwright/test';

export class ReferEarnLocatorsEndToEnd {
    readonly homepageReferEarnTab: Locator;
    readonly referEarnCityInput: Locator;
    readonly homepageReferButton: Locator;
    readonly basicPropertyDetailsHeader: Locator;

    readonly cityDropdownList: Locator;
    readonly localityInput: Locator;
    readonly relationshipWithPropertyOptions: Locator;
   // readonly listingTypeOptions: Locator;
    readonly listingTypeOption: (listingType: string) => Locator;
    readonly preferedTenantsOptions: Locator;
    readonly streetAddressInput: Locator;
    readonly buildingDeatailsInput: Locator;
    readonly landmarkInput: Locator;
    readonly securityDepositSlider: Locator;
    readonly securityDepositDisplayedValue: Locator;
    readonly bhkTypeOptions: Locator;
    readonly furninshingOptions: Locator;
    readonly propertyTypeOptions: Locator;
    readonly basicCancelButton: Locator;
    readonly basicContinueButton: Locator;
    readonly localityFirstOption: Locator;

    readonly parkingOptions: Locator;
    readonly amenitiesOptions: Locator;
    readonly dietPrefrenceOptions: Locator;
    readonly petPreferenceOptions: Locator;
    readonly builtupAreaSlider: Locator;
    readonly floorSlider: Locator;
    readonly builtupAreaDisplayedValue: Locator;
    readonly floorDisplayedValue: Locator;
    readonly availableFromOptions: Locator;
    readonly rentalAgreementOptions: Locator;
    readonly addFeatureButton: Locator;
    readonly nearbyLocalityOptions: Locator;
    readonly featureInput: Locator;
    readonly descriptionInput: Locator;
    readonly additionalCancelButton: Locator;
    readonly additionalContinueButton: Locator;
    readonly setRewardOptions: Locator;
    readonly setPhotos: Locator;
    readonly setVideo: Locator;
    readonly termsButton: Locator;
    readonly publishButton: Locator;
    readonly photosAndReeardsHeader: Locator;
    readonly monthlyRentSlider: Locator;
    readonly monthlyRentDisplayedValue: Locator;



    constructor(private page: Page) {

        //Hero section refer page
        this.homepageReferEarnTab = page.locator("span:has-text('Refer a Home')");

        this.referEarnCityInput = page.locator("(//span[text()='Refer']/ancestor::div)[6]//input");

        this.homepageReferButton = page.locator("//span[text()='Refer']/../..//button");

        this.basicPropertyDetailsHeader = page.getByRole('heading', { name: 'Basic Property Details' });

        //Basic Property Details page
        this.cityDropdownList = page.locator("//label[text()='City ']/following-sibling::select");

        this.localityInput = page.locator("//label[text()='Locality ']/../..//input");

        this.localityFirstOption = page.locator("((//label[text()='Locality ']/../..//input//following-sibling::div//div)[2]//div)[1]");

        this.relationshipWithPropertyOptions = page.locator("//span[text()='Relationship With Property ']/..//div//label");

        //this.listingTypeOptions = page.locator("//span[text()='Listing Type ']/..//div//label");

        this.listingTypeOption = (listingType: string) => {

            const id =
                listingType
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-');

            return page.locator(
                `#listing-${id}`
            );
        };

        this.preferedTenantsOptions = page.locator("//span[text()='Preferred Tenants ']/..//div//label");

        this.streetAddressInput = page.locator("//span[text()='Street Address ']/..//input");

        this.buildingDeatailsInput = page.locator("//span[text()='Building Details (Optional)']/..//input");

        this.landmarkInput = page.locator("//span[text()='Landmark (Optional)']/..//input");

        this.monthlyRentSlider = page.locator("//label[text()='Monthly Rent (₹) ']/..//span[@role='slider']");

        this.monthlyRentDisplayedValue = page.locator("//label[text()='Monthly Rent (₹) ']/..").getByText(/^₹[\d,]+$/).first();

        this.securityDepositSlider = page.locator("//label[text()='Security Deposit (₹)']/..//span[@role='slider']");

        this.securityDepositDisplayedValue = page.locator("//label[text()='Security Deposit (₹)']/..//div[normalize-space()][starts-with(normalize-space(.), '₹')]").first();

        this.bhkTypeOptions = page.locator("//span[text()='BHK Type ']/..//div//label");

        this.furninshingOptions = page.locator("//span[text()='Furnishing ']/..//div//label");

        this.propertyTypeOptions = page.locator("//span[text()='Property Type']/..//div//label");

        this.basicCancelButton = page.getByRole('button', { name: 'Cancel' });

        this.basicContinueButton = page.getByRole('button', { name: 'Continue' });

        //Additional Property Details page
        this.parkingOptions = page.locator("//span[text()='Parking']/..//div//label");

        this.amenitiesOptions = page.locator("//span[text()='Amenities']/..//div//label");

        this.dietPrefrenceOptions = page.locator("//span[text()='Diet Preference']/..//div//label");

        this.petPreferenceOptions = page.locator("//span[text()='Pet Preference']/..//div//label");

        this.builtupAreaSlider = page.locator("(//span[text()='Built Up Area (sq. ft.)']/..//span[@role='slider'])[2]");

        this.floorSlider = page.locator("//span[text()='Floor']/..//span[@role='slider']");

        this.builtupAreaDisplayedValue = page.locator("//span[text()='Built Up Area (sq. ft.)']/..//input").nth(1);

        this.floorDisplayedValue = page.locator("//span[text()='Floor']/..//div[normalize-space()]").first();

        this.availableFromOptions = page.locator("//span[text()='Available From']/..//div//label");

        this.rentalAgreementOptions = page.locator("//span[text()='Rental Agreement']/..//div//label");

        this.nearbyLocalityOptions = page.locator("//h3[text()='Nearby Locality']/..//div//label");

        this.addFeatureButton = page.getByRole('button', { name: '+ Add Feature' });

        this.featureInput = page.getByPlaceholder('Feature name');

        this.descriptionInput = page.getByPlaceholder('Description');

        this.additionalCancelButton = page.getByRole('button', { name: 'Cancel' });

        this.additionalContinueButton = page.getByRole('button', { name: 'Continue' });

        //Photos & Review page
        this.photosAndReeardsHeader = page.getByRole('heading', { name: 'Photos & Review' });

        this.setRewardOptions = page.locator("//h3[text()='Set Your Referral Reward']/../../..");

        this.setPhotos = page.locator("//button[text()='Select Photos']");

        this.setVideo = page.locator("//button[text()='Select Video']");

        this.termsButton = page.locator("button#terms");

        this.publishButton = page.locator("//button[text()='Publish Listing']");



    }
}