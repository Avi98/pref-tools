const interactions = async (ctx) => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  // Navigate to coffee order site
  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  await flow.startTimespan({ stepName: 'Select coffee' });

  // Select coffee
  const cappuccinoItem = '[data-test=Espresso]';
  await page.waitForSelector(cappuccinoItem);
  await page.click(cappuccinoItem);

  await flow.endTimespan();

  await flow.startTimespan({ stepName: 'Checkout order' });

  // Checkout order
  const checkoutBtn = '[data-test=checkout]';
  await page.waitForSelector(checkoutBtn);
  await page.click(checkoutBtn);

  const nameInputSelector = '#name';
  await page.waitForSelector(nameInputSelector);
  await page.type(nameInputSelector, 'nina');

  const emailInputSelector = '#email';
  await page.waitForSelector(emailInputSelector);
  await page.type(emailInputSelector, 'nina@gmail.com');

  await flow.endTimespan();

  await flow.startTimespan({ stepName: 'Submit order' });

  // Submit order
  const submitBtn = '#submit-payment';
  await page.click(submitBtn);
  await page.waitForSelector(submitBtn);
  const successMsg = '.snackbar.success';
  await page.waitForSelector(successMsg);

  await flow.endTimespan();
};

const userFlowProvider = {
  flowOptions: { name: 'Order Coffee' },
  interactions,
};

module.exports = userFlowProvider;
