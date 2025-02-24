const { DEFAULT_THEME } = require('@cucumber/pretty-formatter')

const config = {
    paths: ['tests/**/*.feature'],
    require: ['tests/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
        'summary',
        'progress-bar',
        'html:reports/cucumber/cucumber-report.html',
        'json:reports/cucumber/cucumber-report.json',
        'allure-cucumberjs/reporter'
    ],
    formatOptions: { ...DEFAULT_THEME, snippetInterface: 'async-await', resultsDir: "reports/allure/allure-results"},
    colors: true
};

const api = { ...config, tags: "@api" };
const ui = { ...config, tags: "@ui" };

module.exports = {
    default: config,
    api,
    ui
};
