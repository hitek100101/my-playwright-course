// Import the core testing functions and assertion utilities from the Playwright Test runner library
import { test, expect } from '@playwright/test';

// Import our custom Page Object classes so the script knows how to interact with the UI
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { CustomerFormPage } from '../../pages/CustomerFormPage';

test.describe('SmartBank Application - Customer Management Workflows (Data-Driven)', () => {

  const customerTitles = ['Mr.', 'Ms.', 'Mrs.', 'Miss','Dr.'];
  const actionButtons = ['Save', 'Save & Add another', 'Cancel'];
  //const actionButtons = ['Save', 'Save & Add another'];

  for (const titleCase of customerTitles) {
    for (const buttonAction of actionButtons) {

      //test(`Should handle workflow for Title: "${titleCase}" using Button: "${buttonAction}" `, async ({ page }) => {
      test(`Should handle workflow for Title: "${titleCase}" using Button: "${buttonAction}" @regression`, async ({ page }) => {
        
        // ========================================================
        // INITIALIZE ALL PAGE OBJECT BLUEPRINTS
        // ========================================================
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const customersPage = new CustomersPage(page);
        const customerFormPage = new CustomerFormPage(page);

        // 1. Generate a unique 7-digit random account number anchor
        const uniqueAccountNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
        const cleanTitleSuffix = titleCase.replace('.', ''); 

        const newCustomerDetails = {
          accountNumber: uniqueAccountNumber,
          title: titleCase,
          firstName: 'John',
          lastName: `Doe${cleanTitleSuffix}`, 
          street: '123 Test St',
          city: 'Richmond',
          province: 'British Columbia',
          postalCode: 'V6X 1X7',
          phone: '(604)555-0122',
          email: `john.doe.${uniqueAccountNumber}@example.com`
        };

        // ========================================================
        // STEP 1: Sign In and Navigate to Dashboard Page
        // ========================================================
        await loginPage.navigateTo(); 
        await loginPage.enterCredentials('York', 'admin', 'password');
        await loginPage.clickSignIn();

        const welcomeAdminProfile = await dashboardPage.getWelcomeProfile();
        const branchHeader = await dashboardPage.getBranchHeader();
        
        await expect(welcomeAdminProfile).toContainText('Welcome admin');
        await expect(branchHeader).toBeVisible();

        // ========================================================
        // STEP 2: Navigate to Customers Page & Verify Room Entry
        // ========================================================
        await dashboardPage.goToCustomers();
        const customersPageHeading = await customersPage.getCustomersHeader();
        await expect(customersPageHeading).toBeVisible();

        await customersPage.showAllRows();

        // ========================================================
        // STEP 3: Click Add Customer and Verify Form Entry
        // ========================================================
        await customersPage.clickAddCustomer();
        const formHeader = await customerFormPage.getPageHeader();
        await expect(formHeader).toBeVisible();

        // ========================================================
        // DATA POPULATION & DYNAMIC FORM ACTION ROUTING
        // ========================================================
        await customerFormPage.fillCustomerForm(newCustomerDetails);

        if (buttonAction === 'Save') {
          await customerFormPage.clickSubmit();

        } else if (buttonAction === 'Save & Add another') {
          await customerFormPage.submitWithSpecificButton('Save & Add another');

        } else if (buttonAction === 'Cancel') {
          await customerFormPage.clickCancel();
        }

        // ========================================================
        // CONDITIONAL ASSERTIONS BASED ON ACTIONS
        // ========================================================
        if (buttonAction === 'Save') {
          // Redirected back to Customers grid automatically -> verify record row exists
          await expect(customersPageHeading).toBeVisible();
          const targetRow = page.getByRole('row', { name: newCustomerDetails.accountNumber });
          await expect(targetRow).toBeVisible();

        } else if (buttonAction === 'Save & Add another') {
          // 1. UI RESET VALIDATION: Verify form remains open but inputs have completely blanked out
          await expect(formHeader).toBeVisible();
          await expect(page.getByLabel('Account #')).toHaveValue('');

          // 2. BACKGROUND DATA CHECK: Navigate explicitly to table view to verify the record was saved
          await dashboardPage.goToCustomers();
          await customersPage.showAllRows(); 
          
          const verifiedRow = page.getByRole('row', { name: newCustomerDetails.accountNumber });
          await expect(verifiedRow).toBeVisible();

        } else if (buttonAction === 'Cancel') {
          // Bailed directly back to main grid -> check table to make sure it is completely missing
          await expect(customersPageHeading).toBeVisible();
          const missingRow = page.getByRole('row', { name: newCustomerDetails.accountNumber });
          await expect(missingRow).not.toBeVisible();
        }

        // ========================================================
        // TEARDOWN AND CLEANUP
        // ========================================================
        await dashboardPage.goToDashboard();
        await expect(branchHeader).toBeVisible();
        
        await dashboardPage.clickLogout();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();


        // ========================================================
        // ⏳ ANTI-BRUTE FORCE PACING DELAY
        // ========================================================
        // Pause for 3 seconds to let the SmartBank application firewall cool down
        // before the next parallel or iterative loop attempts another login.
        await page.waitForTimeout(3000);


      });
    }
  }
});