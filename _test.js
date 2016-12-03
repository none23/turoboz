const phantomcss = require('phantomcss')

casper.test.begin('Tags', function (test) {
  phantomcss.init({
    rebase: casper.cli.get('rebase')
  })
  casper.start('http://127.0.0.1:3000/')
  casper.viewport(1366, 768)

  casper.then(function () {
    phantomcss.screenshot('body', '_test_body_1366x768')
  })

  casper.then(function now_check_the_screenshots () {
    phantomcss.compareAll()
  })

  casper.run(function () {
    console.log('Done!')
    casper.test.done()
  })
})
