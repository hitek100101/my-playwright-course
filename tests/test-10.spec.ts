import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.hitekschool.com/lms/3108/login');
  await page.getByRole('textbox', { name: 'Branch Name*' }).fill('York');
  await page.getByRole('textbox', { name: 'User Name*' }).click();
  await page.getByRole('textbox', { name: 'User Name*' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Customers' }).click();
  await page.getByRole('link', { name: '9112334' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.locator('#livewire-error').click();
  await page.locator('iframe').contentFrame().locator('header').filter({ hasText: 'public / index.php :' }).click();
  await page.locator('#livewire-error').click();
  await page.locator('iframe').contentFrame().locator('header').filter({ hasText: 'public / index.php :' }).click();
});