import { test, expect } from '@playwright/test';

test('Verify LMS interaction using stable locators', async ({ page }) => {
  
  // 1. Navigate to the Target Application Area
  await page.goto('https://qa.hitekschool.com/lms/3108/login');


  // 2. Locate Branch, Username and Password via Labels

// Ultimate fallback using resilient regex matching
  await page.getByLabel('Branch Name*').fill('York'); 
  await page.getByLabel(/User Name/i).fill('admin');
  await page.getByLabel(/Password/i).fill('password');


  // 3. Submit Form via Role Strategy
  await page.getByRole('button', { name: 'Sign in' }).click();

await page.goto('https://qa.hitekschool.com/lms/3108/login');
  // 4. Validate Dashboard Navigation via User-Visible Text. It will pass as long as the text starts with "Welcome"
  //await expect(page.getByText(/^Welcome/)).toBeVisible();
  // This will look for any element containing the word "Welcome" anywhere in its text
  await expect(page.getByText(/Welcome/i)).toBeVisible();

  //OR
  // 4. Validate Dashboard Navigation via User-Visible Text
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

  // 5. Logout
  await page.getByRole('button', { name: 'Log out' }).click();

  // 6. Assert success of logout
  await expect(page.getByText('Sign in to your Branch account', { exact: true })).toBeVisible();
});