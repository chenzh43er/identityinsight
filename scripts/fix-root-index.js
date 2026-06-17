const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

html = html.replace(/\.\/testname\/js\/jquery\.min\.js(\?V=20200214)?/g, '/shared/js/jquery.min.js$1');
html = html.replace(/\.\/testname\/js\/google_adv\.js/g, '/shared/js/google_adv.js');
html = html.replace(/\.\/testname\/js\/footJs\.js/g, '/shared/js/footJs.js');
html = html.replace(/\.\/testname\/css\/one\.css/g, '/shared/css/one.css');
html = html.replace(/\/testname\/img\/icon\//g, '/shared/img/icon/');
html = html.replace(/src="\.\/testname\/js\/headerJs\.js"/g, 'src="/shared/js/header.root.js"');

fs.writeFileSync(file, html, 'utf8');
console.log('Fixed root index.html');
