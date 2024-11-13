import { remote } from 'webdriverio'

const browser = await remote({
    automationProtocol: 'devtools',
    capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['disable-notifications', 'start-maximized']
        }
    }
});

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

await browser.url(`https://login.salesforce.com`)
await browser.$('#username').setValue(username)
await browser.$('#password').setValue(password);
await browser.$('#Login').click();

/*
 * integration - assert truth
 * e.g. Title = "Sales Home"
 */

/*
 * performance - get resources
 * e.g. How long did it take. How much memory was used
 */


var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );
stdin.on( 'data', async function( key ) { 
    await browser.deleteSession(); process.exit();
});

