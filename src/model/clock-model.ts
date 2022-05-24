export class ClockModel {

    private hour: number;
    private minute: number;
    private second: number;

    constructor(hour: number, minute: number, second: number) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    setClock(hour: number, minute: number, second: number) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    setHour(value: number) {
        this.hour = value;
    }

    setMinute(value: number) {
        this.minute = value;
    }

    setSecond(value: number) {
        this.second = value;
    }

    getHour() {
        return this.hour;
    }

    getMinute() {
        return this.minute;
    }

    getSecond() {
        return this.second;
    }
}
