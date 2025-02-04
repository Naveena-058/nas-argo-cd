import {By, until, WebDriver, Key} from 'selenium-webdriver';
import {Base} from '../base';
import UiTestUtilities from '../UiTestUtilities';
import * as Const from '../Constants';

const CREATE_APPLICATION_BUTTON_CREATE: By = By.xpath('.//button[@qe-id="applications-list-button-create"]');
const CREATE_APPLICATION_BUTTON_CANCEL: By = By.xpath('.//button[@qe-id="applications-list-button-cancel"]');

const CREATE_APPLICATION_FIELD_APP_NAME: By = By.xpath('.//input[@qeid="application-create-field-app-name"]');
const CREATE_APPLICATION_FIELD_PROJECT: By = By.xpath('.//input[@qe-id="application-create-field-project"]');
const CREATE_APPLICATION_FIELD_REPOSITORY_URL: By = By.xpath('.//input[@qe-id="application-create-field-repository-url"]');
const CREATE_APPLICATION_FIELD_REPOSITORY_REVISION: By = By.xpath("//input[@value='HEAD']")
const CREATE_APPLICATION_FIELD_REPOSITORY_PATH: By = By.xpath('.//input[@qe-id="application-create-field-path"]');

const CREATE_APPLICATION_DROPDOWN_DESTINATION: By = By.xpath('.//div[@qe-id="application-create-dropdown-destination"]');
const CREATE_APPLICATION_DROPDOWN_MENU_URL: By = By.xpath('.//li[@qe-id="application-create-dropdown-destination-URL"]');
const CREATE_APPLICATION_DROPDOWN_MENU_NAME: By = By.xpath('.//li[@qe-id="application-create-dropdown-destination-NAME"]');

export const DESTINATION_MENU_NAME: string = 'NAME';
export const DESTINATION_MENU_URL: string = 'URL';

const CREATE_APPLICATION_FIELD_CLUSTER_NAME: By = By.xpath('.//input[@qe-id="application-create-field-cluster-url"]'); //is used for cluster URL
const CREATE_APPLICATION_FIELD_CLUSTER_NAMESPACE: By = By.xpath('.//input[@qeid="application-create-field-namespace"]'); //destination cluster namespace
const CREATE_APPLICATION_FIELD_CLUSTER_URL: By = By.xpath('.//input[@qe-id="application-create-field-cluster-url"]'); //destination cluster URL

export class ApplicationCreatePanel extends Base {
    public constructor(driver: WebDriver) {
        super(driver);
    }

    public async setAppName(appName: string): Promise<void> {
        try {
            const appNameField = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_APP_NAME);
            await this.driver.wait(until.elementIsVisible(appNameField), 10000);
            await appNameField.sendKeys(appName);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting app name: ' + err);
            throw new Error(err);
        }
    }

    public async setProjectName(projectName: string): Promise<void> {
        try {
            const project = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_PROJECT);
            await project.sendKeys(projectName);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting project name: ' + err);
            throw new Error(err);
        }
    }

    public async setSourceRepoUrl(sourceRepoUrl: string): Promise<void> {
        try {
            const reposUrl = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_REPOSITORY_URL);
            await reposUrl.sendKeys(sourceRepoUrl);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting source repo URL: ' + err);
            throw new Error(err);
        }
    }

    public async setSourceRepoPath(sourceRepoPath: string): Promise<void> {
        try {
            const path = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_REPOSITORY_PATH);
            await path.sendKeys(sourceRepoPath);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting source repo path: ' + err);
            throw new Error(err);
        }
    }

    public async setRepositoryRevision(repositoryRevision: string): Promise<void> {
        try {
            const revisionField = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_REPOSITORY_REVISION);
            const currentValue = await revisionField.getAttribute('value');

            // If the repositoryRevision is "HEAD", don't change the field's value
            if (repositoryRevision === 'HEAD') {
                UiTestUtilities.log('Repository revision is HEAD, skipping update.');
                return; 
            }

            // If the repositoryRevision is not "HEAD", update the field's value
            if (currentValue !== repositoryRevision) {
                await revisionField.click(); 
                UiTestUtilities.log('Repository revision is not HEAD, So clearing the values .');
                await revisionField.sendKeys(Key.BACK_SPACE.repeat(20)); 
                await revisionField.sendKeys(repositoryRevision);
            }
            
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting repository revision: ' + err);
            throw new Error(err);
        }
    }

    public async setSyncPolicy(syncPolicy: string): Promise<void> {
        try {
            // Locate the dropdown element
            const dropdownXPath = By.xpath("//label[contains(text(),'Sync Policy')]/following-sibling::div");
            const dropdownElement = await UiTestUtilities.findUiElement(this.driver, dropdownXPath);

            // Check if the current sync policy is not 'Manual'
            if (syncPolicy !== "Manual") {
                UiTestUtilities.log("Sync policy is not 'Manual', selecting 'Automatic'.");
                await dropdownElement.click();

                // Locate the search box and enter "Automatic"
                const searchBoxXPath = By.xpath("//label[contains(text(),'Sync Policy')]/following-sibling::div//input[@class='select__search']");
                const searchBox = await UiTestUtilities.findUiElement(this.driver, searchBoxXPath);
                await searchBox.sendKeys(syncPolicy);
                UiTestUtilities.log(`Searched for '${syncPolicy}' in the dropdown.`);


                // Locate the 'Automatic' option in the dropdown
                const automaticOptionXPath = By.xpath("//label[text()='Sync Policy']/following-sibling::div[@class='select']//span[text()='Automatic']");
                const automaticOption = await UiTestUtilities.findUiElement(this.driver, automaticOptionXPath);
                // Click the 'Automatic' option
                await automaticOption.click();
            } else {
                UiTestUtilities.log("Sync policy is 'Manual', no action required.");
            }
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting sync policy: ' + err);
            throw new Error(err);
        }
    }

    /**
     * Convenience method to select the Destination Cluster URL menu and set the url field with destinationClusterFieldValue
     *
     * @param destinationClusterFieldValue
     */
    public async selectDestinationClusterURLMenu(destinationClusterFieldValue: string): Promise<void> {
        try {
            const clusterCombo = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_DROPDOWN_DESTINATION);
            // click() doesn't work. Use script
            await UiTestUtilities.click(this.driver, clusterCombo);
            const urlMenu = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_DROPDOWN_MENU_URL);
            await urlMenu.click();
            if (destinationClusterFieldValue) {
                await this.setDestinationClusterUrl(destinationClusterFieldValue);
            }
        } catch (err: any) {
            UiTestUtilities.log('Error caught while selecting destination cluster URL menu: ' + err);
            throw new Error(err);
        }
    }

    /**
     * Convenience method to select the Destination Cluster Name menu and set the namefield with destinationClusterFieldValue
     *
     * @param destinationClusterFieldValue
     */
    public async selectDestinationClusterNameMenu(destinationClusterFieldValue: string): Promise<void> {
        try {
            const clusterCombo = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_DROPDOWN_DESTINATION);
            // click() doesn't work. Use script
            await UiTestUtilities.click(this.driver, clusterCombo);
            const nameMenu = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_DROPDOWN_MENU_NAME);
            await UiTestUtilities.click(this.driver, nameMenu);
            if (destinationClusterFieldValue) {
                await this.setDestinationClusterName(destinationClusterFieldValue);
            }
        } catch (err: any) {
            UiTestUtilities.log('Error caught while selecting destination cluster name menu: ' + err);
            throw new Error(err);
        }
    }

    public async setDestinationClusterName(destinationClusterName: string): Promise<void> {
        try {
            
            const clusterName = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_CLUSTER_NAME);
            await clusterName.sendKeys(destinationClusterName);
            // await clusterName.sendKeys('\r');
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting destination cluster name: ' + err);
            throw new Error(err);
        }
    }

    public async setDestinationClusterUrl(destinationClusterUrl: string): Promise<void> {
        try {
            const clusterUrl = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_CLUSTER_URL);
            await clusterUrl.sendKeys(destinationClusterUrl);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting destination cluster URL: ' + err);
            throw new Error(err);
        }
    }

    public async setDestinationNamespace(destinationNamespace: string): Promise<void> {
        try {
            const namespace = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_FIELD_CLUSTER_NAMESPACE);
            await namespace.sendKeys(destinationNamespace);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while setting destination namespace: ' + err);
            throw new Error(err);
        }
    }


    /**
     * Click the Create button to create the app
     */
    public async clickCreateButton(): Promise<void> {
        try {
            const createButton = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_BUTTON_CREATE);
            await createButton.click();

            // Wait until the Create Application Sliding Panel disappears
            await this.driver.wait(until.elementIsNotVisible(createButton), Const.TEST_SLIDING_PANEL_TIMEOUT).catch((e) => {
                UiTestUtilities.logError('The Create Application Sliding Panel did not disappear');
                throw e;
            });
            await this.driver.sleep(1000);
        } catch (err: any) {
            UiTestUtilities.log('Error caught while clicking Create button: ' + err);
            throw new Error(err);
        }
    }

    /**
     * Click the Cancel Button.  Do not create the app.
     */
    public async clickCancelButton(): Promise<void> {
        try {
            const cancelButton = await UiTestUtilities.findUiElement(this.driver, CREATE_APPLICATION_BUTTON_CANCEL);
            await cancelButton.click();

            // Wait until the Create Application Sliding Panel disappears
            await this.driver.wait(until.elementIsNotVisible(cancelButton), Const.TEST_SLIDING_PANEL_TIMEOUT).catch((e) => {
                UiTestUtilities.logError('The Create Application Sliding Panel did not disappear');
                throw e;
            });
        } catch (err: any) {
            UiTestUtilities.log('Error caught while clicking Cancel button: ' + err);
            throw new Error(err);
        }
    }

    /**
     * Convenience method to create an application given the following inputs to the dialog
     *
     * TODO add Sync Policy and Sync Options and setter methods above
     *
     * @param appName
     * @param projectName
     * @param sourceRepoUrl
     * @param sourceRepoPath
     * @param destinationMenu
     * @param destinationClusterName
     * @param destinationNamespace
     */
    public async createApplication(
        appName: string,
        projectName: string,
        sourceRepoUrl: string,
        sourceRepoPath: string,
        destinationClusterName: string,
        destinationNamespace: string,
        syncPolicy: string, 
        repositoryRevision: string 
    ): Promise<void> {
        UiTestUtilities.log('About to create application');
        try {
            await this.setAppName(appName);
            await this.setProjectName(projectName);
            await this.setSourceRepoUrl(sourceRepoUrl);
            await this.setSourceRepoPath(sourceRepoPath);
            await this.setRepositoryRevision(repositoryRevision);
            await this.setSyncPolicy(syncPolicy);
            await this.selectDestinationClusterNameMenu(destinationClusterName);
            await this.setDestinationNamespace(destinationNamespace);
            await this.clickCreateButton();
        } catch (err: any) {
            throw new Error(err);
        }
    }
}