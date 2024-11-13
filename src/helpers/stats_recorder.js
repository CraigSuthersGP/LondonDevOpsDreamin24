import statsHelper from './stats.js';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs';
import dateFormat from 'dateformat';

class stats_recorder {
  #ept = new Array();
  #currentRun;
  #id = uuidv4();
  
  constructor() {
  }

  add_ept(ept, page, windowSize) {
    let run = this.#currentRun;
    this.#ept.push({ ept: Math.round(ept), page, run, windowSize });
  }

  async save_screenshot(browser, name) {
    let run = ('' + this.#currentRun).padStart(2, '0');
    let filename = this.#id + '_' + run + '_' + name + '.png';
    await browser.saveScreenshot('screenshots/' + filename)
  }

  async get_stats_result() {

    let eptStats = new Map();
    let windowSizesMap = new Map();

    for (let i = 0; i < this.#ept.length; i++) {
        if (!eptStats.has(this.#ept[i].page)) {
            eptStats.set(this.#ept[i].page, new Array());
            windowSizesMap.set(this.#ept[i].page, new Array());
        }

        eptStats.get(this.#ept[i].page).push(this.#ept[i].ept);
        windowSizesMap.get(this.#ept[i].page).push(this.#ept[i].windowSize);
    }

    const pageStats = new Array();

    for (let [key, value] of eptStats) {
        const stats = new statsHelper(value);
        const pageStat = {
            page: key,
            count: stats.get_count(),
            sum: stats.get_sum(),
            average: stats.get_average(),
            median: stats.get_median(),
            stdev: stats.get_stdev(),
            min: stats.get_min(),
            max: stats.get_max(),
            raw: value
        }

        pageStats.push(pageStat);
    }

    return  { id: this.#id,
              system: {
                type: os.type(),
                release: os.release(),
                platform: os.platform(),
                hostname: os.hostname()
            }, pageStats, epts: this.#ept };
  }

  async writeStats() {
    let resultText = JSON.stringify(await this.get_stats_result());
    let day = dateFormat(new Date(), "yyyymmddHHMMss");
    let filename = './results/' + day + '.json';
    fs.writeFile(filename, resultText, err => {
      if (err) {
        console.error(err);
     }
  });
}

  start_run(run) {
    this.#currentRun = run;
  }

  stop_run() {
    this.#currentRun = null;
  }
}

export default stats_recorder;
