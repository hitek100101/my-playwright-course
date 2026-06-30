
 
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { CustomerFormPage } from '../../pages/CustomerFormPage';


//test.describe('SmartBank Customer Management Framework (Static Data) @smoke', () => {
test.describe('SmartBank Customer Management Framework (Static Data) @smoke @regression', () => {

  

  // 👇 ADD THIS LINE BACK RIGHT HERE to force top-to-bottom serial execution 👇
  test.describe.configure({ mode: 'serial' });

  const branchName = 'York';
  const loginUser = 'admin';
  const loginPass = 'password';
  
  // Explicitly defined known account number used for data tracking
  const knownAccountNumber = '7778889';

  // ========================================================
  // TEST 1: ADD CUSTOMER
  // ========================================================
  test('Add Customer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customersPage = new CustomersPage(page);

    const newCustomerDetails = {
      accountNumber: knownAccountNumber,
      title: 'Mr.',
      firstName: 'John',
      lastName: 'Doe'
    };

    await loginPage.navigateTo(); 
    await loginPage.enterCredentials(branchName, loginUser, loginPass);
    const dashboardPage = await loginPage.clickSignIn();

    await dashboardPage.goToCustomers();
    const customersPageHeading = await customersPage.getCustomersHeader();
    await expect(customersPageHeading).toBeVisible();
    await customersPage.showAllRows();   

    const customerFormPage = await customersPage.clickAddCustomer();
    const formHeader = await customerFormPage.getPageHeader();
    await expect(formHeader).toBeVisible();

    await customerFormPage.fillCustomerForm(newCustomerDetails);
    await customerFormPage.clickSubmit();

    await expect(page.getByRole('status')).toContainText('Created');
    
    // Explicit assertion validating our known account number string row is visible
    const targetRow = page.getByRole('row', { name: knownAccountNumber });
    await expect(targetRow).toBeVisible();

    await dashboardPage.goToDashboard();
    await dashboardPage.clickLogout();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  // ========================================================
  // TEST 2: EDIT CUSTOMER
  // ========================================================
  test('Edit Customer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customersPage = new CustomersPage(page);

    const updatedCustomerDetails = {
      firstName: 'Robert',
      lastName: 'Smith'
    };

    await loginPage.navigateTo(); 
    await loginPage.enterCredentials(branchName, loginUser, loginPass);
    const dashboardPage = await loginPage.clickSignIn();

    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();   

    // Finds the row matching our known number and clicks Edit
    await customersPage.clickEditCustomerLink(knownAccountNumber);

    const customerFormPage = new CustomerFormPage(page);
    await customerFormPage.fillCustomerForm(updatedCustomerDetails);
    await customerFormPage.clickSubmit(); 

    await expect(page.getByRole('status')).toContainText('Saved');

    // Confirm modifications show up next to our static record tracking row
    const targetRow = page.getByRole('row', { name: knownAccountNumber });
    await expect(targetRow).toContainText(updatedCustomerDetails.firstName);
    await expect(targetRow).toContainText(updatedCustomerDetails.lastName);

    await dashboardPage.goToDashboard();
    await dashboardPage.clickLogout();
  });

  // ========================================================
  // TEST 3: DELETE CUSTOMER
  // ========================================================
  test('Delete Customer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customersPage = new CustomersPage(page);

    await loginPage.navigateTo(); 
    await loginPage.enterCredentials(branchName, loginUser, loginPass);
    const dashboardPage = await loginPage.clickSignIn();

    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();   

    // Purges our known record out of the grid
    await customersPage.deleteCustomer(knownAccountNumber);

    await expect(page.getByRole('status')).toContainText('Deleted');

    // Asserts that the known account number is completely missing
    const trackingRow = page.getByRole('row', { name: knownAccountNumber });
    await expect(trackingRow).not.toBeVisible();

    await dashboardPage.goToDashboard();
    await dashboardPage.clickLogout();
  });

});