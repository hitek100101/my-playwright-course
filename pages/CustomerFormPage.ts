
import { Page, Locator } from '@playwright/test';

// TypeScript interface managing all inputs present on the SmartBank form fields
export interface CustomerData {
  accountNumber?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
}

export class CustomerFormPage {
  private readonly page: Page;
  
  private pageHeader: Locator;
  // Specific SmartBank Form Field Locators
  private accountInput: Locator;
  private titleDropdown: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private streetInput: Locator;
  private cityInput: Locator;
  private provinceDropdown: Locator;
  private postalCodeInput: Locator;
  private phoneInput: Locator;
  private emailInput: Locator;
  
  // Form Action Buttons
  private submitButton: Locator;
  private cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Smart Locator: Dynamically targets the main page heading whether it's "Add Customer" or "Edit Customer"
    this.pageHeader = page.locator('h1, h2, .main-heading');
    
    // Mapping precisely to the labels visible on the UI in image_388af1.png
    this.accountInput = page.getByLabel('Account #');
    this.titleDropdown = page.getByLabel('Title:');
    this.firstNameInput = page.getByLabel('First Name:');
    this.lastNameInput = page.getByLabel('Last Name:');
    
    this.streetInput = page.getByLabel('Street:');
    this.cityInput = page.getByLabel('City:');
    this.provinceDropdown = page.getByLabel('Province:');
    this.postalCodeInput = page.getByLabel('Postal Code:');
    
    this.phoneInput = page.getByLabel('Phone:');
    this.emailInput = page.getByLabel('Email:');

    // FIXED: The regex pattern now dynamically catches "Save" (Add page) OR "Save changes" (Edit page)
    this.submitButton = page.getByRole('button', { name: /^(Save changes|Save)$/i });
    // Uses a clean text or loose locator string so it bypasses strict casing/whitespace rules
    this.cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel")');
  }

  /**
   * Fills out the entire form dynamically based on provided properties.
   * Works seamlessly for both brand-new records and partial edits.
   */
  async fillCustomerForm(data: CustomerData): Promise<void> {
    if (data.accountNumber) {
      await this.accountInput.fill(data.accountNumber);
    }
    if (data.title) {
      await this.titleDropdown.selectOption({ label: data.title });
    }
    if (data.firstName) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.street) {
      await this.streetInput.fill(data.street);
    }
    if (data.city) {
      await this.cityInput.fill(data.city);
    }
    if (data.province) {
      await this.provinceDropdown.selectOption({ label: data.province });
    }
    if (data.postalCode) {
      await this.postalCodeInput.fill(data.postalCode);
    }
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.email) {
      await this.emailInput.fill(data.email);
    }
  }

  /**
   * Universal workflow action to click the submission button.
   * This automatically clicks "Save" or "Save changes" based on which page is open.
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Universal workflow action to abort form changes.
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Dynamic action handler supporting the nested data-driven loop variations required in Part 2.
   */
  async submitWithSpecificButton(buttonText: 'Save' | 'Save changes' | 'Save & Add another' | 'Cancel'): Promise<void> {
    if (buttonText === 'Cancel') {
      await this.clickCancel();
    } else {
      await this.page.getByRole('button', { name: buttonText, exact: true }).click();
    }
  }

    //Fetches the heading locator instance for the current page state.
       async getPageHeader(): Promise<Locator> {
  return this.pageHeader;
  }
}

