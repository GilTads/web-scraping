var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const cpf = '000000000'
    await page.goto('http://www2.detran.ms.gov.br/detranet/nsite/habilitacao/exames/cExa.asp');

   
    await page.type('tr:nth-child(2) > td:nth-child(2) > input[type=text]', cpf);

    // await page.screenshot({path: 'foto1.png'});

    page.click('.Box');
    await page.waitForNavigation();
    // await page.screenshot({path: 'foto2.png'});

    const result = await page.evaluate(() => {
      const exame = {};
      document.querySelectorAll('body > table.frm > tbody > tr:nth-child(6) > td > div > center > table > tbody > tr:nth-child(3)')
        .forEach(ex => {
          exame.tipo = ex
            .querySelector('tr:nth-child(3) > td:nth-child(1)').innerText;
            exame.data = ex
            .querySelector('tr:nth-child(3) > td:nth-child(2)').innerText;
            exame.resultado = ex
            .querySelector('tr:nth-child(3) > td:nth-child(4)').innerText;
        });
      return exame;
    });
    browser.close();
    return result;
  };

  scrape().then(value => res.json(value));
});

module.exports = router;
