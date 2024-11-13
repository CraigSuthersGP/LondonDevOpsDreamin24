import ept_capture from '../src/helpers/ept_capture.js';
import stats_recorder from './helpers/stats_recorder.js';
import { remote } from 'webdriverio'
import fs from 'node:fs';

function initialize() {
    // Make sure the required folders exist: 
    // 1. ./screenshots
    // 2. ./results
    if (!fs.existsSync('./screenshots')) {
        fs.mkdirSync('./screenshots');
    }
    if (!fs.existsSync('./results')) {
        fs.mkdirSync('./results');
    }

    // Confirm the PASSWORD environment variable is set
    if (!process.env.PASSWORD) {
        console.error('Please set the PASSWORD environment variable');
        process.exit(1);
    }
}

async function login(browser, eptCapture, statsRecorder) {
    await browser.url('https://login.salesforce.com')
    let username = process.env.USERNAME;
    let password = process.env.PASSWORD;

    await browser.$('#username').setValue(username)
    await browser.$('#password').setValue(password);
    await browser.$('#Login').click();

    var homePageEpt = await eptCapture.get_ept(browser);

    statsRecorder.add_ept(homePageEpt.duration, 'home', await browser.getWindowSize());
    await statsRecorder.save_screenshot(browser, 'sflandingpage');
}

async function gotoAccountOH(browser, eptCapture, statsRecorder) {
    var click_on_account_js =  'var one_appnav = document.querySelector("one-appnav"); \
                                var one_app_nav_bar = one_appnav.shadowRoot.querySelector("one-app-nav-bar"); \
                                var nav = one_app_nav_bar.shadowRoot.querySelector("one-app-nav-bar-item-root[data-id=Account]"); \
                                var a = nav.shadowRoot.querySelector("a[title=Accounts]"); \
                                a.click();';

    await browser.execute(click_on_account_js);

    var objectHomeEpt = await eptCapture.get_ept(browser);
    statsRecorder.add_ept(objectHomeEpt.duration, 'OH', await browser.getWindowSize());
    await statsRecorder.save_screenshot(browser, 'sfaccountoh');
}

async function gotoFirstAccountRH(browser, eptCapture, statsRecorder) {
    await browser.$('a[data-refid="recordId"]').click();

    var recordHomeEpt = await eptCapture.get_ept(browser);
    statsRecorder.add_ept(recordHomeEpt.duration, 'RH', await browser.getWindowSize());
    await statsRecorder.save_screenshot(browser, 'sfaccountrh');
}

async function executeTest(run, statsRecorder) {
    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['disable-notifications', 'start-maximized']
            }
        }
    });

    // await browser.setTimeout({ 'script': 60000 })
    
    let eptCapture = new ept_capture();

    statsRecorder.start_run(run, browser);
    await login(browser, eptCapture, statsRecorder);

    // click on the Account nav menu item
    await gotoAccountOH(browser, eptCapture, statsRecorder);

    // click on the Recent Item Account
    await gotoFirstAccountRH(browser,   eptCapture, statsRecorder);
    statsRecorder.stop_run();

    await browser.deleteSession();
}

initialize();

let statsRecorder = new stats_recorder();

for (var run = 1; run <= 3; run++) {
    await executeTest(run, statsRecorder);
}

await statsRecorder.writeStats();
