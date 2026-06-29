import { defineConfig, devices } from '@playwright/test';

/* ========================================================================== */
/* 🏢 CENTRALIZED FRAMEWORK VARIABLES                                         */
/* ========================================================================== */
/**
 * BUILD_NUMBER: Change this version variable when a new build is deployed to QA.
 * Centralizing this at the top of your configuration prevents you from having to
 * manually hunt down and change URLs across dozens of different individual test files.
 */
const BUILD_NUMBER = '3108'; 

/**
 * Playwright Configuration File: Local Timing & Execution Control Blueprint
 * This file serves as the basis for Chapter 13.3, establishing the core timing 
 * properties required to run stable automation suites locally.
 */
export default defineConfig({
  /* ========================================================================== */
  /* 1. STRUCTURAL & DIRECTORY MANAGEMENT                                       */
  /* ========================================================================== */

  /**
   * testDir: Maps the primary location where Playwright scans for test files.
   * Enforces code organization by separating test scripts from Page Objects.
   */
  testDir: './tests',

  /* Run tests in files in parallel across available local CPU cores */
  fullyParallel: true,

  // /* Fail the build if a developer accidentally leaves 'test.only' in the code */
  // forbidOnly: false, // 💡 Note: Will be automated using process.env.CI in the CI/CD chapter
  /**
   * forbidOnly: Fails the build if 'test.only' is accidentally left in code.
   * On CI, this ensures developers don't accidentally skip the entire suite.
   */
  forbidOnly: !!process.env.CI,

  /* ========================================================================== */
  /* 2. TIMING, TIMEOUTS, AND RETRIES (CORE CHAPTER 13.3)                       */
  /* ========================================================================== */

  /**
   * timeout: The Global Test Timeout (The Outer Box).
   * Sets the absolute maximum limit for an entire single test block (in milliseconds).
   * If exceeded, the test runner triggers a hard kill switch.
   */
  timeout: 30000, // 30 seconds

  /**
   * retries: Isolates structural test flakiness.
   * Sets the number of times Playwright immediately re-runs a failed test file.
   * Hardcoded to 1 here so students can observe the "Flaky" status locally.
   */
  //retries: 1, // 💡 Hardcoded for local mastery: Replaces "process.env.CI ? 2 : 0" for this chapter
   retries: process.env.CI ? 2 : 1,

  /**
   * workers: Sets the number of concurrent execution threads.
   * Passing 'undefined' tells Playwright to automatically optimize speed by 
   * leveraging all available local CPU cores.
   */
  //workers: undefined, // 💡 Hardcoded for local mastery: Replaces "process.env.CI ? 1 : undefined"
  workers: process.env.CI ? 1 : undefined,

  /* ========================================================================== */
  /* 3. ASSERTION LEVEL TIMEOUTS                                                */
  /* ========================================================================== */
  expect: {
    /**
     * timeout: Expect Assertion Timeout.
     * The maximum time a Web-First Assertion (e.g., expect(locator).toBeVisible())
     * will poll the DOM before throwing an error. Uses intelligent micro-polling.
     */
    timeout: 5000, // 5 seconds (Default value, explicitly declared for student clarity)
  },

  /* Reporter to use. Generates a local interactive browser dashboard. */
  reporter: 'html',

  /* ========================================================================== */
  /* 4. ACTION & INTERACTION TIMEOUTS                                           */
  /* ========================================================================== */
  use: {
    /**
     * baseURL: Base URL to use in actions like `await page.goto('/')`.
     * Dynamically appends the centralized build number variable.
     */
    baseURL: `https://qa.hitekschool.com/lms/${BUILD_NUMBER}/`,
    //baseURL: `https://qa.hitekschool.com/lms/`,

    /**
     * actionTimeout: Maximum time allowed for individual explicit browser steps.
     * Examples: await page.click(), await page.fill(), await page.hover().
     * If an element is blocked or slow to render, the step waits up to this limit.
     */
    actionTimeout: 10000, // 10 seconds (Upgraded from the default '0' no-limit boundary)

    /**
     * navigationTimeout: Maximum time allowed for explicit page loading events.
     * Examples: await page.goto(), await page.waitForURL().
     */
    navigationTimeout: 15000, // 15 seconds

    /* Collect trace when retrying a failed test to capture logs and snapshots */
    trace: 'on-first-retry',
    
    /* Capture visual test evidence automatically on failures */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers to ensure cross-browser test coverage */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});






// import { defineConfig, devices } from '@playwright/test';

// /**
//  * Read environment variables from file.
//  * https://github.com/motdotla/dotenv
//  */
// // import dotenv from 'dotenv';
// // import path from 'path';
// // dotenv.config({ path: path.resolve(__dirname, '.env') });


// // 🏢 CENTRALIZED BUILD VARIABLE: Change this one version number when a new build is deployed
// const BUILD_NUMBER = '3108'; 

// /**
//  * See https://playwright.dev/docs/test-configuration.
//  */
// export default defineConfig({
  
 
//   /* -------------------------------------------------------------------------- */
//   /* 1. ROOT LEVEL SETTINGS (Global Test Automation Boundaries)                 */
//   /* -------------------------------------------------------------------------- */
  
//   // The absolute maximum duration for an entire individual test block.
//   // Default: 30000ms (30 seconds).
//   timeout: 30000, 

//   // Total number of times to automatically re-run a failed test execution.
//   // Useful for filtering out environmental or network flakiness.
//   retries: process.env.CI ? 2 : 0,

//   // Opt out of parallel tests on CI to conserve server memory; maximize locally.
//   workers: process.env.CI ? 1 : undefined,

//   // Reporter to use. See https://playwright.dev/docs/test-reporters
//   reporter: 'html',

//   /* -------------------------------------------------------------------------- */
//   /* 2. ASSERTION LEVEL SETTINGS (Web-First Polling Timeouts)                 */
//   /* -------------------------------------------------------------------------- */
//   expect: {
//     /**
//      * Maximum time an individual web-first assertion can wait for a condition.
//      * Examples: await expect(locator).toBeVisible() or .toHaveText()
//      * Default: 5000ms (5 seconds).
//      */
//     timeout: 5000,
//   },

//   /* -------------------------------------------------------------------------- */
//   /* 3. ACTION & ARTIFACT SETTINGS (Default Browser Context Options)            */
//   /* -------------------------------------------------------------------------- */
//   use: {
//     // Base URL to use in actions like `await page.goto('/')`.
//     baseURL: 'https://qa.hitekschool.com/lms/',

//     // Control artifact generation based on test outcomes
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     trace: 'on-first-retry',

//     /**
//      * Maximum time allowed for any single explicit action step to complete.
//      * Examples: await page.click(), await page.fill(), await page.press()
//      * Default: 0 (No timeout limit; completely relies on the global test timeout instead).
//      */
//     actionTimeout: 10000, // 10 seconds

//     /**
//      * Maximum time allowed for page navigation events to resolve.
//      * Examples: await page.goto(), await page.waitForURL()
//      * Default: 0 (No timeout limit).
//      */
//     navigationTimeout: 15000, // 15 seconds
//   },

//   /* -------------------------------------------------------------------------- */
//   /* 4. ENVIRONMENT MATRICES (Browser Projects execution)                      */
//   /* -------------------------------------------------------------------------- */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },
//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },
//   ],
// });



//   /* /* -------------------------------------------------------------------------- */
//   /* 1. ROOT LEVEL SETTINGS (Global Test Automation Boundaries)                 */
//   /* -------------------------------------------------------------------------- */
  
//   // The absolute maximum duration for an entire individual test block.
//   // Default: 30000ms (30 seconds).
//   timeout: 30000, 

//   // Total number of times to automatically re-run a failed test execution.
//   // Useful for filtering out environmental or network flakiness.
//   retries: process.env.CI ? 2 : 0,
  
//   testDir: './tests',
//   /* Run tests in files in parallel */
//   fullyParallel: true,
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   retries: process.env.CI ? 2 : 0,
//   /* Opt out of parallel tests on CI. */
//   workers: process.env.CI ? 1 : undefined,
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   reporter: 'html',


//   /* -------------------------------------------------------------------------- */
//   /* 2. ASSERTION LEVEL SETTINGS (Web-First Polling Timeouts)                 */
//   /* -------------------------------------------------------------------------- */
//   expect: {
//     /**
//      * Maximum time an individual web-first assertion can wait for a condition.
//      * Examples: await expect(locator).toBeVisible() or .toHaveText()
//      * Default: 5000ms (5 seconds).
//      */
//     timeout: 5000,
  



//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

//   use: {
//     /* Base URL to use in actions like `await page.goto('')`. */
//     baseURL: `https://qa.hitekschool.com/lms/${BUILD_NUMBER}/`, //Note the trailing slash here!

    
//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: 'on-first-retry',

//     // ➕ MANUALLY ADD THESE TWO LINES TO UPGRADE YOUR FRAMEWORK:
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
    

//     /* // 🎥 FORCE VIDEO RECORDING IN VS CODE GUI:
//     // This tells the browser context to drop the video files here regardless of extension settings
//     contextOptions: {
//       recordVideo: {
//         dir: './test-results'
//       }
//     }
//  */
//   },

//   /* Configure projects for major browsers */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },

//     /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     /* Test against branded browsers. */
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   /* Run your local dev server before starting the tests */
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://localhost:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });
//  */