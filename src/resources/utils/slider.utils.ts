import { Locator } from '@playwright/test';

export class SliderUtils {

    // =========================================================
    // Method 1:
    // Used when aria-valuenow is NOT the actual amount.
    //
    // Example:
    // Monthly Rent
    // aria-valuenow = 30
    // UI value      = ₹15,000
    //
    // Security Deposit can also use this method.
    // =========================================================

    static async setSliderValue(
        slider: Locator,
        displayedValue: Locator,
        targetAmount: number
    ): Promise<void> {

        // -----------------------------------------
        // 1. Validate target
        // -----------------------------------------

        if (
            targetAmount === undefined ||
            targetAmount === null ||
            Number.isNaN(targetAmount)
        ) {
            throw new Error(
                `Invalid target amount: ${targetAmount}`
            );
        }


        // -----------------------------------------
        // 2. Wait for slider and displayed value
        // -----------------------------------------

        await slider.waitFor({
            state: 'visible'
        });

        await displayedValue.waitFor({
            state: 'visible'
        });


        // -----------------------------------------
        // 3. Read slider range
        // -----------------------------------------

        const minSliderValue = Number(
            await slider.getAttribute('aria-valuemin')
        );

        const maxSliderValue = Number(
            await slider.getAttribute('aria-valuemax')
        );

        let currentSliderValue = Number(
            await slider.getAttribute('aria-valuenow')
        );


        if (
            Number.isNaN(minSliderValue) ||
            Number.isNaN(maxSliderValue) ||
            Number.isNaN(currentSliderValue)
        ) {
            throw new Error(
                `Unable to read slider values. ` +
                `Min=${minSliderValue}, ` +
                `Max=${maxSliderValue}, ` +
                `Current=${currentSliderValue}`
            );
        }


        // -----------------------------------------
        // 4. Read current displayed amount
        // -----------------------------------------

        let currentAmount =
            await this.getDisplayedValue(
                displayedValue
            );


        console.log('==========================================');
        console.log(
            'Target Amount:',
            targetAmount
        );
        console.log(
            'Current Amount:',
            currentAmount
        );
        console.log(
            'Current Slider Value:',
            currentSliderValue
        );
        console.log(
            'Slider Min:',
            minSliderValue
        );
        console.log(
            'Slider Max:',
            maxSliderValue
        );
        console.log('==========================================');


        // -----------------------------------------
        // 5. Already at target
        // -----------------------------------------

        if (currentAmount === targetAmount) {

            console.log(
                `Slider is already set to ₹${targetAmount}`
            );

            return;
        }


        // -----------------------------------------
        // 6. Decide direction
        // -----------------------------------------

        const direction =
            targetAmount > currentAmount
                ? 'ArrowRight'
                : 'ArrowLeft';


        // -----------------------------------------
        // 7. Focus slider
        // -----------------------------------------

        await slider.focus();


        // -----------------------------------------
        // 8. Maximum movements
        // -----------------------------------------

        const maxAttempts =
            Math.abs(
                maxSliderValue -
                minSliderValue
            ) + 5;


        // -----------------------------------------
        // 9. Move slider one keyboard step
        // -----------------------------------------

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            const previousSliderValue =
                currentSliderValue;

            const previousAmount =
                currentAmount;


            // Move one step

            await slider.press(direction);


            // Read slider state

            currentSliderValue =
                Number(
                    await slider.getAttribute(
                        'aria-valuenow'
                    )
                );


            // Read actual UI amount

            currentAmount =
                await this.getDisplayedValue(
                    displayedValue
                );


            console.log(
                `Movement ${attempt}` +
                ` | Slider=${currentSliderValue}` +
                ` | Amount=₹${currentAmount}`
            );


            // -------------------------------------
            // Exact target
            // -------------------------------------

            if (
                currentAmount === targetAmount
            ) {

                console.log(
                    '=========================================='
                );

                console.log(
                    `SUCCESS: Slider set to ₹${targetAmount}`
                );

                console.log(
                    `Final Slider Value: ${currentSliderValue}`
                );

                console.log(
                    `Total Movements: ${attempt}`
                );

                console.log(
                    '=========================================='
                );

                return;
            }


            // -------------------------------------
            // Target passed while moving right
            // -------------------------------------

            if (
                direction === 'ArrowRight' &&
                currentAmount > targetAmount
            ) {

                throw new Error(
                    `Target ₹${targetAmount} was passed. ` +
                    `Previous amount=₹${previousAmount}, ` +
                    `Current amount=₹${currentAmount}`
                );
            }


            // -------------------------------------
            // Target passed while moving left
            // -------------------------------------

            if (
                direction === 'ArrowLeft' &&
                currentAmount < targetAmount
            ) {

                throw new Error(
                    `Target ₹${targetAmount} was passed. ` +
                    `Previous amount=₹${previousAmount}, ` +
                    `Current amount=₹${currentAmount}`
                );
            }


            // -------------------------------------
            // Slider did not move
            // -------------------------------------

            if (
                currentSliderValue ===
                previousSliderValue
            ) {

                throw new Error(
                    `Slider did not move. ` +
                    `Slider value=${currentSliderValue}, ` +
                    `UI amount=₹${currentAmount}`
                );
            }


            // -------------------------------------
            // Maximum reached
            // -------------------------------------

            if (
                direction === 'ArrowRight' &&
                currentSliderValue >=
                    maxSliderValue
            ) {

                throw new Error(
                    `Slider reached maximum before ` +
                    `target ₹${targetAmount}. ` +
                    `Current amount=₹${currentAmount}`
                );
            }


            // -------------------------------------
            // Minimum reached
            // -------------------------------------

            if (
                direction === 'ArrowLeft' &&
                currentSliderValue <=
                    minSliderValue
            ) {

                throw new Error(
                    `Slider reached minimum before ` +
                    `target ₹${targetAmount}. ` +
                    `Current amount=₹${currentAmount}`
                );
            }
        }


        // -----------------------------------------
        // 10. Target not found
        // -----------------------------------------

        throw new Error(
            `Unable to set slider to ₹${targetAmount}. ` +
            `Final amount=₹${currentAmount}, ` +
            `Final slider value=${currentSliderValue}`
        );
    }


    // =========================================================
    // Method 2:
    // Used when aria-valuenow IS the actual value.
    //
    // Example:
    // Built Up Area
    //
    // aria-valuenow = 10000
    // Actual value  = 10000
    //
    // No displayedValue locator is required.
    // =========================================================

    static async setSliderValueByAria(
        slider: Locator,
        targetValue: number
    ): Promise<void> {

        // -----------------------------------------
        // 1. Validate target
        // -----------------------------------------

        if (
            targetValue === undefined ||
            targetValue === null ||
            Number.isNaN(targetValue)
        ) {
            throw new Error(
                `Invalid target slider value: ${targetValue}`
            );
        }


        // -----------------------------------------
        // 2. Wait for slider
        // -----------------------------------------

        await slider.waitFor({
            state: 'visible'
        });


        // -----------------------------------------
        // 3. Read slider values
        // -----------------------------------------

        const min =
            Number(
                await slider.getAttribute(
                    'aria-valuemin'
                )
            );

        const max =
            Number(
                await slider.getAttribute(
                    'aria-valuemax'
                )
            );

        let current =
            Number(
                await slider.getAttribute(
                    'aria-valuenow'
                )
            );


        if (
            Number.isNaN(min) ||
            Number.isNaN(max) ||
            Number.isNaN(current)
        ) {
            throw new Error(
                `Unable to read slider values. ` +
                `Min=${min}, ` +
                `Max=${max}, ` +
                `Current=${current}`
            );
        }


        // -----------------------------------------
        // 4. Validate target range
        // -----------------------------------------

        if (
            targetValue < min ||
            targetValue > max
        ) {
            throw new Error(
                `Target ${targetValue} is outside ` +
                `slider range ${min}-${max}`
            );
        }


        console.log('==========================================');
        console.log(
            'Target Slider Value:',
            targetValue
        );
        console.log(
            'Current Slider Value:',
            current
        );
        console.log(
            'Slider Min:',
            min
        );
        console.log(
            'Slider Max:',
            max
        );
        console.log('==========================================');


        // -----------------------------------------
        // 5. Already at target
        // -----------------------------------------

        if (current === targetValue) {

            console.log(
                `Slider is already set to ${targetValue}`
            );

            return;
        }


        // -----------------------------------------
        // 6. Focus slider
        // -----------------------------------------

        await slider.focus();


        // -----------------------------------------
        // 7. Decide direction
        // -----------------------------------------

        const direction =
            targetValue > current
                ? 'ArrowRight'
                : 'ArrowLeft';


        // -----------------------------------------
        // 8. Move one step at a time
        // -----------------------------------------

        const maxAttempts =
            Math.abs(max - min) + 5;


        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            const previous =
                current;


            await slider.press(direction);


            current =
                Number(
                    await slider.getAttribute(
                        'aria-valuenow'
                    )
                );


            console.log(
                `Movement ${attempt}` +
                ` | Slider=${current}`
            );


            // -------------------------------------
            // Exact target
            // -------------------------------------

            if (
                current === targetValue
            ) {

                console.log(
                    '=========================================='
                );

                console.log(
                    `SUCCESS: Slider set to ${targetValue}`
                );

                console.log(
                    `Total Movements: ${attempt}`
                );

                console.log(
                    '=========================================='
                );

                return;
            }


            // -------------------------------------
            // Slider did not move
            // -------------------------------------

            if (current === previous) {

                throw new Error(
                    `Slider did not move. ` +
                    `Current value=${current}`
                );
            }


            // -------------------------------------
            // Boundary check
            // -------------------------------------

            if (
                direction === 'ArrowRight' &&
                current >= max
            ) {

                throw new Error(
                    `Slider reached maximum ` +
                    `${max} before target ` +
                    `${targetValue}`
                );
            }


            if (
                direction === 'ArrowLeft' &&
                current <= min
            ) {

                throw new Error(
                    `Slider reached minimum ` +
                    `${min} before target ` +
                    `${targetValue}`
                );
            }
        }


        // -----------------------------------------
        // Target not found
        // -----------------------------------------

        throw new Error(
            `Unable to set slider to ${targetValue}. ` +
            `Final value=${current}`
        );
    }


    // =========================================================
    // Read displayed slider value
    // =========================================================

    private static async getDisplayedValue(
        displayedValue: Locator
    ): Promise<number> {

        const text =
            await displayedValue.innerText();


        /*
         * Supported examples:
         *
         * ₹30,000
         * ₹50,000
         * 30,000
         * 1500 sq. ft.
         */

        const cleanedValue =
            text
                .replace(/,/g, '')
                .replace(/[^\d.-]/g, '')
                .trim();


        const value =
            Number(cleanedValue);


        if (
            cleanedValue === '' ||
            Number.isNaN(value)
        ) {

            throw new Error(
                `Unable to parse displayed slider value: "${text}"`
            );
        }


        return value;
    }
}