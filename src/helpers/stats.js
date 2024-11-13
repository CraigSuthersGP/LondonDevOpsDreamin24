class stats{
    #data;

    constructor(data) {
        this.#data = data;
    }

    get_count() {
        return this.#data.length;
    }

    get_sum() {
        let sum = 0;
        for (let i = 0; i < this.#data.length; i++) {
            sum += this.#data[i];
        }
        return sum;
    }

    get_average() {
        return this.get_sum() / this.#data.length;
    }

    get_median() {
        let sorted = this.#data.sort();
        let mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    get_stdev() {
        let mean = this.get_average();
        let sum = 0;
        for (let i = 0; i < this.#data.length; i++) {
            sum += Math.pow(this.#data[i] - mean, 2);
        }
        return Math.sqrt(sum / this.#data.length);
    }

    get_min() {
        return Math.min(...this.#data);
    }   

    get_max() {
        return Math.max(...this.#data);
    }
}

export default stats;