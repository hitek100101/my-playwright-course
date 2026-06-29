import { Page, Locator } from '@playwright/test';

export class UserProfilePageNew {
  private page: Page;
  private pageHeading: Locator;
  private usernameInput: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private emailInput: Locator;
  private avatarFileInput: Locator;
  private updateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.getByRole('heading', { name: 'My Profile' });
    this.usernameInput = page.getByLabel(/Username/i);
    this.firstNameInput = page.getByLabel(/First Name/i);
    this.lastNameInput = page.getByLabel(/Last Name/i);
    this.emailInput = page.getByLabel(/Email/i);
    this.avatarFileInput = page.getByLabel(/Drag & Drop your files or Browse/i);
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async navigateTo() {
    await this.page.goto('https://qa.hitekschool.com/lms/3108/my-profile');
  }

  async fillProfileInformation(profile: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    if (profile.firstName !== undefined) await this.firstNameInput.fill(profile.firstName);
    if (profile.lastName !== undefined) await this.lastNameInput.fill(profile.lastName);
    if (profile.email !== undefined) await this.emailInput.fill(profile.email);
  }

  async uploadAvatar(avatarPath: string) {
    await this.avatarFileInput.setInputFiles(avatarPath);
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async updateProfile(details: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarPath?: string;
  }) {
    await this.fillProfileInformation(details);
    if (details.avatarPath) {
      await this.uploadAvatar(details.avatarPath);
    }
    await this.clickUpdate();
  }

  async getPageHeading() {
    return this.pageHeading;
  }
}
