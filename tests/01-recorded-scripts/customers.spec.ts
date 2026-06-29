import { test, expect } from '@playwright/test';

// Go up one folder, then look inside the functions folder
import { loginToLoanApp, logout, fillAddCustomerFields } from '../../functions/authFunctions'; 


const testCases = [ 
  { account: '1234567', firstName: 'Good', lastName: 'Will', title: 'Mr.' },
  { account: '2345678', firstName: 'June', lastName: 'Smith', title: 'Mrs.' }, 
  { account: '3456790', firstName: 'Johanna', lastName: 'Carpenter', title: 'Miss' }, 
  { account: '4567901', firstName: 'Linda', lastName: 'Johnson', title: 'Ms.' }, 
  { account: '5679012', firstName: 'Olga', lastName: 'Steveston', title: 'Ms.' }
];


// Loop through each data set to generate parameterized tests dynamically 
testCases.forEach(({ account, firstName, lastName, title }) => { 

    test(`Add Customer valid input - Account: ${account}`, async ({ page }) => {

    // Call the reusable login function 
     await loginToLoanApp(page, 'York', 'admin', 'password'); 
  
     // Click the Customers link
    await page.getByRole('link', { name: 'Customers' }).click();

    // Click Add Customer link 
    await page.getByRole('link', { name: 'Add Customer' }).click();

    //Fill in the Add Customer form fields using the reusable function
    await fillAddCustomerFields(page, account, firstName, lastName, title);
  
    // assertion to validate that the new customer appears in the Customers table on Customers page
    await expect(page.getByRole('link', { name: account })).toBeVisible();

    //Return to the Dashboard page
    await page.getByRole('link', { name: 'Dashboard' }).click();
 
    // Logout of the application
    await page.getByRole('button', { name: 'Log out' }).click();
}); 

});



testCases.forEach(({ account, firstName, lastName, title }) => {

  test(`Delete customer workflow - Account: ${account}`, async ({ page }) => {

      
      // Call the reusable login function  
      await loginToLoanApp(page, 'York', 'admin', 'password'); 

        // Click the Users link  
        await page.getByRole('link', { name: 'Customers' }).click(); 

        // Click the customer we want to delete
        await page.getByRole('link', { name: account }).click();
        
        // Click Delete button
        await page.getByRole('button', { name: 'Delete' }).click();
        
        // Confirm the deleteion
        await page.getByRole('button', { name: 'Yes, delete it' }).click();
        
        // Verify 'Deleted' message appears on the screen
        await expect(page.getByRole('status')).toContainText('Deleted');

        // Verify that the link matching the deleted customer's account is no longer in the Customers table
        await expect(page.getByRole('link', { name: account })).not.toBeVisible();
        
        // Click the Dashboard link 
        await page.getByRole('link', { name: 'Dashboard' }).click(); 
    
        // Call the reusable logout function 
        await logout(page); 
      
  });


});