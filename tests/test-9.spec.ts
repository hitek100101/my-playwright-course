import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.hitekschool.com/lms/3108/login');
  await page.getByRole('textbox', { name: 'Branch Name*' }).fill('York');
  await page.getByRole('textbox', { name: 'User Name*' }).click();
  await page.getByRole('textbox', { name: 'User Name*' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('password');
  await page.getByRole('textbox', { name: 'Password*' }).press('Enter');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Customers' }).click();
  await page.getByRole('link', { name: 'Add Customer' }).click();
  await page.getByRole('textbox', { name: 'Account #:*' }).click();
  await page.getByRole('textbox', { name: 'Account #:*' }).fill('0012334');
  await page.getByRole('textbox', { name: 'First Name:*' }).click();
  await page.getByRole('textbox', { name: 'First Name:*' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last Name:*' }).click();
  await page.getByRole('textbox', { name: 'Last Name:*' }).fill('Test');
  await page.getByLabel('Title:').selectOption('Mr.');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
});