import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.hitekschool.com/lms/3108/login');
  await page.getByRole('textbox', { name: 'Branch Name*' }).fill('York');
  await page.getByRole('textbox', { name: 'User Name*' }).click();
  await page.getByRole('textbox', { name: 'User Name*' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('row', { name: 'Select/deselect item 201 for' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.locator('tr:nth-child(10) > .fi-ta-cell.p-0.first-of-type\\:ps-1.last-of-type\\:pe-1.sm\\:first-of-type\\:ps-3.sm\\:last-of-type\\:pe-3.fi-table-cell-trash > .fi-ta-col-wrp > .flex.w-full').click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.getByRole('button', { name: 'Delete' }).nth(5).click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.getByRole('button', { name: 'Delete' }).nth(3).click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.locator('tr:nth-child(8) > .fi-ta-cell.p-0.first-of-type\\:ps-1.last-of-type\\:pe-1.sm\\:first-of-type\\:ps-3.sm\\:last-of-type\\:pe-3.fi-table-cell-trash > .fi-ta-col-wrp > .flex.w-full').click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();


  await page.locator('tr:nth-child(7) > .fi-ta-cell.p-0.first-of-type\\:ps-1.last-of-type\\:pe-1.sm\\:first-of-type\\:ps-3.sm\\:last-of-type\\:pe-3.fi-table-cell-trash > .fi-ta-col-wrp > .flex.w-full').click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await page.getByRole('button', { name: 'Delete' }).nth(3).click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
});