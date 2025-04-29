import {By, WebDriver, until} from 'selenium-webdriver';
import UiTestUtilities from '../UiTestUtilities';
import Configuration from '../Configuration';


const label = `${Configuration.OSC_LABEL_KEY}=${Configuration.OSC_LABEL_VALUE}`; // Concatenate the label key and value
// Log the concatenated label for debugging
// UiTestUtilities.log(`The label to be applied is: ${label}`);
// Locators for login
const ADVANCED_BUTTON1: By = By.css('button#details-button.secondary-button.small-link');
const PROCEED_LINK1: By = By.css('a#proceed-link.small-link');

const ADVANCED_BUTTON2: By = By.css('button#details-button.secondary-button.small-link');
const PROCEED_LINK2: By = By.css('a#proceed-link.small-link');

const LOGINWITH_BTN: By = By.xpath('/html/body/div/div/main/div/ul/li[1]/a');

const USERNAME_FIELD: By = By.id('inputUsername');
const PASSWORD_FIELD: By = By.id('inputPassword');
const LOGIN_BUTTON: By = By.xpath('//button[@type="submit"]');

// Locators for namespace labeling

const MENU_OPT: By = By.xpath("//button[@id='nav-toggle']//*[name()='svg']")
const ADMINISTRATION_BUTTON_SELECTOR: By = By.xpath('//button[@data-quickstart-id="qs-nav-administration"]')
const NAMESPACE_BUTTON_SELECTOR: By = By.xpath('//a[normalize-space()="Namespaces"]')

const NAMESPACE_SELECTOR: By = By.xpath('//input[@placeholder="Search by name..."]');
const CLICK_NAMESPACE: By = By.xpath('//a[normalize-space()="spring-petclinic"]')

const LABEL_EDIT: By = By.xpath('//button[normalize-space()="Edit"]');
const LABEL_VALUE_FIELD: By = By.xpath('//input[@id="tags-input"]');
const APPLY_LABEL_BUTTON: By = By.xpath("//button[@id='confirm-action']");


export class OpenShiftManager {
    private driver: WebDriver;

    public constructor(driver: WebDriver) {
        this.driver = driver;
    }

    /**
     * Logs in to the OpenShift cluster using credentials from the .env file.
     */
    public async login(): Promise<void> {
        try {
            // Navigate to the OpenShift console login page
            console.log(`Navigating to OpenShift login URL: ${Configuration.OSC_URL}`);
            await this.driver.get(Configuration.OSC_URL);

            if (await UiTestUtilities.isElementPresent(this.driver, ADVANCED_BUTTON1)) {
            console.log('Handling security interstitial in OSC...');
            const advancedButton = await UiTestUtilities.findUiElement(this.driver, ADVANCED_BUTTON1);
            await advancedButton.click();
            }

            UiTestUtilities.log('Successfully clicked on advbtn1');
            
            if (await UiTestUtilities.isElementPresent(this.driver, PROCEED_LINK1)) {
                const proceedLink = await UiTestUtilities.findUiElement(this.driver, PROCEED_LINK1);
                await proceedLink.click();
            }

            UiTestUtilities.log('Successfully clicked on PROCEED_LINK1');
            UiTestUtilities.log('waiting for 2nd page loading');
            await this.driver.sleep(10000);

            if (await UiTestUtilities.isElementPresent(this.driver, ADVANCED_BUTTON2)) {
                console.log('Handling security interstitial in OSC...');
                const advancedButton = await UiTestUtilities.findUiElement(this.driver, ADVANCED_BUTTON2);
                await advancedButton.click();
            }

            UiTestUtilities.log('Successfully clicked on advbtn2');

            if (await UiTestUtilities.isElementPresent(this.driver, PROCEED_LINK2)) {
                const proceedLink = await UiTestUtilities.findUiElement(this.driver, PROCEED_LINK2);
                await proceedLink.click();
            }

            UiTestUtilities.log('Successfully clicked on PROCEED_LINK2');

            //login with button click
            const loginwithbtn = await UiTestUtilities.findUiElement(this.driver, LOGINWITH_BTN);
            await loginwithbtn.click();

            UiTestUtilities.log('Successfully clicked on LOGINWITH_BTN');
            
            // Wait for the username field and input the username
            const usernameField = await UiTestUtilities.findUiElement(this.driver, USERNAME_FIELD);
            await usernameField.sendKeys(Configuration.OSC_USERNAME);

            // Input the password
            const passwordField = await UiTestUtilities.findUiElement(this.driver, PASSWORD_FIELD);
            await passwordField.sendKeys(Configuration.OSC_PASSWORD);

            // Click the login button
            const loginButton = await UiTestUtilities.findUiElement(this.driver, LOGIN_BUTTON);
            await loginButton.click();

            // Optional: Wait for the dashboard or a specific element to load
            // await UiTestUtilities.findUiElement(this.driver, By.id('main-dashboard-id'));

            UiTestUtilities.log('Successfully logged into OpenShift cluster.');
        } catch (err: any) {
            throw new Error(`Failed to log in to OpenShift cluster: ${err.message}`);
        }
    }

    /**
     * Add a label to a namespace.
     * @param namespace - The namespace to be labeled.
     */
    public async addLabelToNamespace(namespace: string): Promise<void> {
        try {

            UiTestUtilities.log('started to waiting for label for 2 mins');
            await this.driver.sleep(120000);
            //Click on menu option
            const menuoption = await UiTestUtilities.findUiElement(this.driver, MENU_OPT);
            await this.driver.wait(until.elementIsVisible(menuoption), 120000); // Wait up to 10 seconds for the element to become visible
            UiTestUtilities.log('clicked on menu*************************************');

            // Step 1: Click on the Administration section
            const administrationButton = await UiTestUtilities.findUiElement(this.driver, ADMINISTRATION_BUTTON_SELECTOR);
            await administrationButton.click();

            // Step 2: Select and click on the "Namespace" option
            const namespaceButton = await UiTestUtilities.findUiElement(this.driver, NAMESPACE_BUTTON_SELECTOR);
            await namespaceButton.click();
            
            // Select the namespace
            const namespaceSelector = await UiTestUtilities.findUiElement(this.driver, NAMESPACE_SELECTOR);
            await namespaceSelector.sendKeys(namespace);

            // click on the name space
            const clicknamespace = await UiTestUtilities.findUiElement(this.driver, CLICK_NAMESPACE);
            await clicknamespace.click();

            // Wait for search results (use appropriate wait or sleep here)
            // await this.driver.sleep(2000);  // Wait for the namespace to appear in the search results

            // click on the name space
            const editlable = await UiTestUtilities.findUiElement(this.driver, LABEL_EDIT);
            await editlable.click();

            // // Enter the label key and value
            // const labelKeyField = await UiTestUtilities.findUiElement(this.driver, LABEL_KEY_FIELD);
            // await labelKeyField.sendKeys(Configuration.OSC_LABEL_KEY);


            const labelValueField = await UiTestUtilities.findUiElement(this.driver, LABEL_VALUE_FIELD);
            await labelValueField.sendKeys(label);

            // Click the Apply Label button
            const applyLabelButton = await UiTestUtilities.findUiElement(this.driver, APPLY_LABEL_BUTTON);
            // Check if the button is visible
            const isVisible = await applyLabelButton.isDisplayed();
            console.log(`Button is visible: ${isVisible}`);

            // Check if the button is enabled
            const isEnabled = await applyLabelButton.isEnabled();
            console.log(`Button is enabled: ${isEnabled}`);

            // Check if the button is selected (for checkboxes/radio buttons)
            const isSelected = await applyLabelButton.isSelected();
            console.log(`Button is selected: ${isSelected}`);

            const isClicked = await applyLabelButton.click();
            console.log(`Button is selected: ${isClicked}`);
            
            await this.driver.sleep(6000);

            // UiTestUtilities.log(`Label ${Configuration.OSC_LABEL_VALUE} = applied to namespace ${namespace}.`);
        } catch (err: any) {
            throw new Error(`Failed to add label to namespace ${namespace}: ${err.message}`);
        }
    }
}