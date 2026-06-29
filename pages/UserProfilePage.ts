import { Page, Locator } from '@playwright/test';

export class MyProfilePage {
  readonly page: Page;
  readonly username: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly fileInput: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: /Username/i });
    this.firstName = page.getByRole('textbox', { name: /First Name/i });
    this.lastName = page.getByRole('textbox', { name: /Last Name/i });
    this.email = page.getByRole('textbox', { name: /Email/i });
    // safe selector for the file-upload input inside container with id="data.avatar_url"
    this.fileInput = page.locator('[id="data.avatar_url"] input[type="file"]');
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  /**
   * Fill profile fields and submit the form.
   * avatarPath is optional; if provided, it will be uploaded via the file input.
   */
  async fillProfileAndSubmit(opts: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarPath?: string; // local file system path
  }) {
    if (opts.firstName !== undefined) await this.firstName.fill(opts.firstName);
    if (opts.lastName !== undefined) await this.lastName.fill(opts.lastName);
    if (opts.email !== undefined) await this.email.fill(opts.email);
    if (opts.avatarPath) {
      // setInputFiles accepts string or FilePayload[]
      await this.fileInput.setInputFiles(opts.avatarPath);
    }
    await this.updateButton.click();
  }
}