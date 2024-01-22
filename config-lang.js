const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');
const Cookies = require('js-cookie');

const appPath = path.join(require('electron').remote.app.getPath('exe'), '..');
const translationPath = path.join(__dirname, 'locales');
console.log(__dirname);
// const config = require('./data/config/config.json'); // alterar para o caminho da build --- // const configPath = 'data/config/config.json'; - para build
// Caminho para o arquivo de configuração
const configPath = path.join(appPath, 'data', 'config', 'config.json');

i18next.init({
    // configurações do i18next
}, (err, t) => {
    if (err) {
        console.error(err);
        return;
    }
    // código que depende das chaves de tradução aqui
    console.log('Todas as chaves de tradução foram carregadas.');
});
// função para ler o arquivo de configuração
function readConfigFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(configPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const config = JSON.parse(data);
                resolve(config);
            }
        });
    });
}

// função para inicializar o i18next depois de ler o arquivo de configuração


// ler o arquivo de configuração e inicializar o i18next depois
readConfigFile().then(initializeI18next).catch((err) => {
    console.log('Something went wrong reading the config file.', err);
});

function translate() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18next.t(key);

        // salva a chave na cookie com o valor "1"
        Cookies.set(key, 1, {expires: 365});
    });
    
}

function initializeI18next(config) {
    i18next.use(Backend).init({
        lng: config.language,
        fallbackLng: config.language,
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: path.join(translationPath, '{{lng}}', 'translation.json')
        }
    }, (err, t) => {
        if (err) {
            console.log('Something went wrong initializing the i18next backend.', err);
        } else {
            console.log('i18next backend initialized successfully.');
            document.documentElement.setAttribute('lang', 'PT_PT');
            document.documentElement.setAttribute('data-i18n-loaded', '');
            translate();
            
        }
    });
}

// function testTranslation() {
// i18next.t('file');
// i18next.t('visits');
// i18next.t('open_existing_visit');
// i18next.t('reload_app');
// i18next.t('quit');
// }


module.exports = {
    i18next,
    translate
};
