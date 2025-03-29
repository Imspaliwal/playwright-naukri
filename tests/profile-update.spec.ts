import { test, expect, Browser, Page, Locator } from "@playwright/test";
import dotenv = require("dotenv");
import path = require("path");

import { webkit, chromium, firefox } from "playwright";

dotenv.config({ path: path.resolve(__dirname, ".env") });
const loginURL = process.env.LOGIN_URL as string;
const userEmail = process.env.EMAIL as string;
const userPassword = process.env.PASSWORD as string;

test("Update Naukari Headline", async () => {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();

  const login: Locator = page.getByRole("link", { name: "Login", exact: true });
  const email: Locator = page.getByRole("textbox", {
    name: "Enter your active Email ID /",
  });
  const passowrd: Locator = page.getByRole("textbox", {
    name: "Enter your password",
  });
  const submit: Locator = page.getByRole("button", {
    name: "Login",
    exact: true,
  });

  const viewProfile: Locator = page.getByRole("link", { name: "View profile" });
  const resumeHeadline: Locator = page
    .getByRole("listitem")
    .filter({ hasText: "Resume headline" })
    .locator("span");
  const resumeHeadlineEdit: Locator = page
    .locator("#lazyResumeHead")
    .getByText("editOneTheme");
  const resumeHeadlineTextArea: Locator = page.getByRole("textbox", {
    name: "Minimum 5 words. Sample",
  });

  const saveProfile: Locator = page.getByRole("button", { name: "Save" });

  const successMsg: Locator = page.getByText("Success", { exact: true });

  await page.goto(loginURL);
  await login.click();

  await email.fill(userEmail);
  await passowrd.fill(userPassword);
  await submit.click();

  await viewProfile.click();
  // await page.locator('[id="_ux73u25gy2"]').click();
  await resumeHeadline.click();
  await page.waitForTimeout(5000);
  await resumeHeadline.click();
  await resumeHeadlineEdit.click();

  await resumeHeadlineTextArea.fill(
    "8+ Years of Software QA experience including Manual & Automation Testing with key skills, Selenium, Core Java, JavaScript, Postman, RestAssured, Automation Frameworks, BDD, Cucumber, SQL, CI/CD, Linux, Jenkins and Docker",
  );

  await saveProfile.click();

  await expect(successMsg).toBeVisible();

  await browser.close();
});

test.only("Update Naukari Resume", async () => {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();

  const login: Locator = page.getByRole("link", { name: "Login", exact: true });
  const email: Locator = page.getByRole("textbox", {
    name: "Enter your active Email ID /",
  });
  const passowrd: Locator = page.getByRole("textbox", {
    name: "Enter your password",
  });
  const submit: Locator = page.getByRole("button", {
    name: "Login",
    exact: true,
  });

  const viewProfile: Locator = page.getByRole("link", { name: "View profile" });
  const resume: Locator = page.locator("span").filter({ hasText: /^Resume$/ });

  const successMsg: Locator = page.getByText("Success", { exact: true });

  await page.goto("https://www.naukri.com/");
  await login.click();

  await email.fill("sumitpaliwal08@gmail.com");
  await passowrd.fill("b93kus31");
  await submit.click();

  await viewProfile.click();
  // await page.locator('[id="_ux73u25gy2"]').click();
  // await page.pause();
  await resume.click();
  // await updateResume.click();
  await page.waitForTimeout(5000);

  const resumeFile = path.join(
    process.cwd() + "/tests/Sumit_Paliwal_Resume.pdf",
  );

  // Use fileChooser in case of Input[type='file'] tag is not present in DOM
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator("input[value='Update resume']").click(),
  ]);
  await fileChooser.setFiles([resumeFile]);

  await expect(successMsg).toBeVisible();

  await browser.close();
});
