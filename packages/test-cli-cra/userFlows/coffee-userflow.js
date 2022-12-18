async function captureReport({ browser, startFlow }) {
  const flow = await startFlow(page, { name: 'Single Navigation' });
  await flow.navigate('https://web.dev/performance-scoring/');

  await browser.close();
}

module.exports = {
  interaction: captureReport,
};
