// Import the core testing functions and assertion utilities from the Playwright Test runner library
import { test, expect } from '@playwright/test';

// Import our custom Page Object classes so the script knows how to interact with the UI
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { UsersPage } from '../../pages/UsersPage';
import { UserFormPage } from '../../pages/UserFormPage';

test.describe('SmartBank Application - User Management Workflows', () => {

  // 1. Define the arrays matching your exact roles values and Page Object buttons
  const userRoles = ['Loan Manager', 'Loan Officer', 'Branch Admin'];
  const actionButtons = ['Save', 'Save & Add another', 'Cancel'];

  // 2. Outer Loop: Controls the User Roles
  for (const role of userRoles) {
    // 3. Inner Loop: Controls form buttons
    for (const buttonAction of actionButtons) {

      // Dynamically name the test case based on the parameters
      test(`Should handle workflow for Role: "${role}" using Button: "${buttonAction}"`, async ({ page }) => {
        
        // ========================================================
        // INITIALIZE ALL PAGE OBJECT BLUEPRINTS
        // ========================================================
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const usersPage = new UsersPage(page);
        const userFormPage = new UserFormPage(page);

        // 1. Get the first 3 letters of the role (e.g., "Loan Manager" -> "Loa")
        const shortRole = role.substring(0, 3);

        // 2. Generate a 4-digit random number (e.g., 7842)
        const uniqueId = Math.floor(1000 + Math.random() * 9000);

        // 3. Combine them together 
        const newUserDetails = {
          username: `tester_${shortRole}_${uniqueId}`, // Example result: "tester_Loa_7842"
          password: 'SecurePassword123!',    
          firstName: 'Alex',                 
          lastName: 'Smith',                 
          company: 'Hitek QA Solutions',     
          phone: '(605)555-0199',             
          email: `alex.${uniqueId}@example.com`,   
          role: role 
        };

        // ========================================================
        // STEP 1: Sign In and Navigate to Dashboard Page
        // ========================================================
        await loginPage.navigateTo(); 
        await loginPage.enterCredentials('York', 'admin', 'password');
        await loginPage.clickSignIn();

        // Get Welcome banner andd Branch Header
        const welcomeAdminProfile = await dashboardPage.getWelcomeProfile();
        const branchHeader = await dashboardPage.getBranchHeader();
        
        await expect(welcomeAdminProfile).toContainText('Welcome admin');
        await expect(branchHeader).toBeVisible();

        // ========================================================
        // STEP 2: Navigate to Users Page & Verify Room Entry
        // ========================================================
        // Navigate to Users page
        await dashboardPage.goToUsers();
        
        // Get Users page header
        const usersPageHeading = await usersPage.getUsersHeader();
        await expect(usersPageHeading).toBeVisible();

        // 👇 INSERT THE NEW PAGINATION METHOD HERE 👇
        // This configures the grid to show all rows before starting form submission actions
        await usersPage.showAllRows();

        // ========================================================
        // STEP 3: Click Add User and Verify Form Entry
        // ========================================================
        // Click the Add User button
        await usersPage.clickAddUser();
        
        // Scan userFormPage form header
        const formHeader = await userFormPage.getPageHeader();
        await expect(formHeader).toBeVisible();

        // ========================================================
        // DATA POPULATION & DYNAMIC FORM ACTION ROUTING
        // ========================================================
        // Run encapsulated workflows depending on the parameters loop
        if (buttonAction === 'Save') {
          await userFormPage.createUserAndSave(newUserDetails);

        } else if (buttonAction === 'Save & Add another') {
          await userFormPage.createUserAndAddAnother(newUserDetails);

        } else if (buttonAction === 'Cancel') {
          await userFormPage.createUserAndCancel(newUserDetails);
        }

        // ========================================================
        // CONDITIONAL ASSERTIONS BASED ON ACTIONS
        // ========================================================
        if (buttonAction === 'Save') {
          // Redirected back to Users grid automatically -> check table cell record
          const newUsernameLink = page.getByRole('link', { name: newUserDetails.username, exact: true });
          await expect(newUsernameLink).toBeVisible();

        // } else if (buttonAction === 'Save & Add another') {
        //   // Stays on 'Add User' page with fields cleared -> check visibility and blank values
        //   await expect(formHeader).toBeVisible();
        //   await expect(page.getByLabel('Username*')).toHaveValue('');

        } else if (buttonAction === 'Save & Add another') {
        // 1. UI RESET VALIDATION: Verify form has cleared values but remains open
        await expect(formHeader).toBeVisible();
        await expect(page.getByLabel('Username*')).toHaveValue('');

        // 2. NAvigate to Users page
        await dashboardPage.goToUsers();
        await usersPage.showAllRows(); 
        
        const verifiedUsernameLink = page.getByRole('link', { name: newUserDetails.username, exact: true });
        await expect(verifiedUsernameLink).toBeVisible();


        } else if (buttonAction === 'Cancel') {
          // Bailed back to main table grid -> check table to make sure it is completely missing
          await expect(usersPageHeading).toBeVisible();
          const newUsernameLink = page.getByRole('link', { name: newUserDetails.username, exact: true });
          await expect(newUsernameLink).not.toBeVisible();
        }

        // ========================================================
        // TEARDOWN AND CLEANUP
        // ========================================================
        // Ensure state is normalized before clicking log out
        await dashboardPage.goToDashboard();
        await expect(branchHeader).toBeVisible();
        
        await dashboardPage.clickLogout();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
      });
    }
  }
});

// // =========================================================================
//   // 🚀 NEW TEST CASE: CLEANUP WORKFLOW (LOCATOR CHAINING DELETION)
//   // =========================================================================
//   test('Should successfully locate and delete a specific user from the data grid', async ({ page }) => {
//     // Initialize Page Objects needed for this scenario
//     const loginPage = new LoginPage(page);
//     const dashboardPage = new DashboardPage(page);
//     const usersPage = new UsersPage(page);

//     // Pick an exact known target username created during your previous data loops
//     // (Ensure this matches an expected name variation produced by the matrix above)
//     const targetUsername = 'tester_Loa_5526'; 

//     // Step 1: Handle authentication state entry
//     await loginPage.navigateTo();
//     await loginPage.enterCredentials('York', 'admin', 'password');
//     await loginPage.clickSignIn();
    
//     // Extract the raw locator handle first so expect can watch it dynamically
//     const welcomeProfile = await dashboardPage.getWelcomeProfile();
//     await expect(welcomeProfile).toBeVisible();

//     // Step 2: Route directly to the targeted data grid workspace
//     await dashboardPage.goToUsers();
    
//     // Verify the grid room is loaded securely via our Regex locator
//     const usersHeader = await usersPage.getUsersHeader();
//     await expect(usersHeader).toBeVisible();

//     // Step 3: Expand the data viewport to prevent record-hidden pagination bugs
//     await usersPage.showAllRows();

//     // Step 4: Execute our advanced locator chaining deletion sequence
//     await usersPage.deleteUser(targetUsername);

//     // Step 5: Framework Validation
//     // Assert that the specific row belonging to this user is fully unmounted from the layout tree
//     const deletedRow = page.getByRole('row', { name: targetUsername });
//     await expect(deletedRow).not.toBeVisible();

//     // Final Housekeeping: Return to safe area and exit session
//     await dashboardPage.goToDashboard();
//     await dashboardPage.clickLogout();
//     await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
//   });

//});