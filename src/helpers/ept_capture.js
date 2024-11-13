class ept_capture {
    #eptCount = 0;
    #lastEptCount = 0;
    #eptCountJs = 'return performance.getEntriesByName("PageView EPT").length;';

    get_ept_js() {
        return 'return performance.getEntriesByName("PageView EPT")[' + (this.#eptCount - 1) + '];';
    }

    async get_ept_count(browser) {
        await browser.waitUntil(async () => {
            this.#eptCount = await browser.execute(this.#eptCountJs);
            if (this.#eptCount > this.#lastEptCount)
            {
                this.#lastEptCount++;

                return this.#eptCount;
            };
        }, {
            timeout: 60000,
            timeoutMsg: 'Expected EPT to be 0 after 10s'
        });
    }

    async get_ept(browser) {
        let e = await this.get_ept_count(browser);
        console.log('ept count: ' + e);
        return await browser.execute(this.get_ept_js());
    }
}

export default ept_capture;