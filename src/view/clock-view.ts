import { createElement } from "../util/htlm-element-util";
import { ClockModel } from "../model/clock-model";
//const
const SEC_LIMIT = 59;
const MIN_LIMIT = 59;
const HOUR_LIMIT = 23;
const HOUR_LIMIT_AM = 11;

const MODE_MODIFY = {
    NOT_MODIFY: 0,
    MODIFY_HOUR: 1,
    MODIFY_MINUTES: 2
};

export class ClockView {
    // for change light mode.
    textElm: Element;
    screen: Element;
    // detail contexts
    hourMode: Element;
    hour: Element;
    minute: Element;
    second: Element;
    // button
    btnMode: Element;
    btnIncrease: Element;
    btnLight: Element;
    btnChangeModeHour: Element;
    // logic mode
    modeModify: number;
    isNightMode: boolean;
    is24HourMode: boolean;
    gmt: number;
    clock: ClockModel;

    constructor(gmt: number, parent: Element) {
        this.modeModify = MODE_MODIFY.NOT_MODIFY;
        this.isNightMode = false;
        this.gmt = gmt;
        this.is24HourMode = true;
        this.clock = new ClockModel(0, 0, 0);
        this.changeMode = this.changeMode.bind(this);
        this.lightAction = this.lightAction.bind(this);
        this.increaseAction = this.increaseAction.bind(this);
        this.resetClock = this.resetClock.bind(this);
        this.changeHourMode = this.changeHourMode.bind(this);
        //init
        this.initElement(gmt, parent);
        this.initTimer();
        setInterval(() => this.run(), 1000);
    }

    initElement(gmt: number, _parent: Element) {
        //init elem
        let parent = createElement(_parent);
        createElement(parent, 'div', `GMT ${gmt > 0 ? '+' : ''} ${gmt}`, 'title');
        // clock body
        let clock = createElement(parent, 'div', undefined, 'clock');
        let screen = createElement(clock, 'div', undefined, 'screen', `scr-cl${gmt}`);
        this.screen = screen;
        let detailClock = createElement(screen, 'div', undefined, 'detail', `cl${gmt}`);
        this.textElm = detailClock;

        // details
        this.hour = createElement(detailClock, 'div', undefined, 'h-cl', `h-cl${gmt}`);
        createElement(detailClock, 'div', ':');
        this.minute = createElement(detailClock, 'div', undefined, 'm-cl', `m-cl${gmt}`);
        this.second = createElement(detailClock, 'div', undefined, 's-cl', `s-cl${gmt}`);

        // init mode button
        let btnMode = createElement(clock, 'div', 'M', 'button mode', `mode-cl${gmt}`);
        this.btnMode = btnMode;
        if (btnMode)
            btnMode.addEventListener("click", this.changeMode);

        // init increase button
        let btnIncrease = createElement(clock, 'div', 'I', 'button increase', `increase-cl${gmt}`);
        this.btnIncrease = btnIncrease;
        if (btnIncrease)
            btnIncrease.addEventListener("click", this.increaseAction);

        // init light button
        let btnLight = createElement(clock, 'div', 'L', 'button light', `light-cl${gmt}`);
        this.btnLight = btnLight;
        if (btnLight)
            btnLight.addEventListener("click", this.lightAction);

        this.hourMode = createElement(clock, 'div', '', 'ampm-cl', `ampm-cl${gmt}`);

        let btnReset = createElement(parent, 'button', 'Reset', 'button reset', `reset-cl${gmt}`);
        if (btnReset)
            btnReset.addEventListener("click", this.resetClock);

        let btnChangeModeHour = createElement(parent, 'button', 'Change To AM/PM', 'button reset', `ampm-cl${gmt}`);
        this.btnChangeModeHour = btnChangeModeHour;
        if (btnChangeModeHour)
            btnChangeModeHour.addEventListener("click", this.changeHourMode);
    }

    normalize(nb: number) {
        let str = nb.toString();
        if (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }

    initTimer() {
        let time = new Date();
        let hour = time.getUTCHours() + this.gmt;
        if (hour > 24)
            hour = hour - 24;
        else if (hour < 0)
            hour = hour + 24;

        if (!this.is24HourMode) {
            this.hourMode.innerHTML = hour >= 12 ? 'PM' : 'AM';
            hour = hour > 12 ? hour - 12 : hour;
        }
        this.clock.setClock(hour, time.getMinutes(), time.getSeconds());

        this.hour.textContent = this.normalize(hour);
        this.minute.textContent = this.normalize(time.getMinutes());
        this.second.textContent = this.normalize(time.getSeconds());
    }

    changeMode() {
        this.modeModify = this.modeModify === MODE_MODIFY.MODIFY_MINUTES ? MODE_MODIFY.NOT_MODIFY : (this.modeModify + 1);
        if (this.modeModify === MODE_MODIFY.MODIFY_HOUR) {
            this.hour.setAttribute("style", "animation: blinker 1s linear infinite;");
        }
        else if (this.modeModify === MODE_MODIFY.MODIFY_MINUTES) {
            this.hour.setAttribute("style", "animation: none;");
            this.minute.setAttribute("style", "animation: blinker 1s linear infinite;");
        }
        else {
            this.hour.setAttribute("style", "animation: none;");
            this.minute.setAttribute("style", "animation: none;");
        }
    }

    increaseSec() {
        let secValue = this.clock.getSecond();
        if (secValue === SEC_LIMIT) {
            this.clock.setSecond(0);
            this.second.textContent = "00";
        }
        else {
            ++secValue
            this.clock.setSecond(secValue);
            this.second.textContent = this.normalize((secValue));
        }
    }

    increaseMinute() {
        let minuteValue = this.clock.getMinute();
        if (minuteValue === MIN_LIMIT) {
            this.clock.setMinute(0);
            this.minute.textContent = "00";
        }
        else {
            ++minuteValue;
            this.clock.setMinute(minuteValue);
            this.minute.textContent = this.normalize((minuteValue));
        }
    }

    increaseHour() {
        let hourValue = this.clock.getHour()
        if ((hourValue === HOUR_LIMIT && this.is24HourMode)
            || (hourValue === HOUR_LIMIT_AM && !this.is24HourMode && this.hourMode.innerHTML === 'PM')) {
            if (!this.is24HourMode)
                this.hourMode.innerHTML = 'AM';
            this.clock.setHour(0);
            this.hour.textContent = "00";
        }
        else {
            if (hourValue === HOUR_LIMIT_AM && !this.is24HourMode && this.hourMode.innerHTML === 'AM')
                this.hourMode.innerHTML = 'PM';
            ++hourValue;
            this.clock.setHour(hourValue);
            this.hour.textContent = this.normalize((hourValue));
        }
    }

    increaseAction() {
        if (this.modeModify === 0)
            return;

        if (this.modeModify === 1) {
            this.increaseHour();
            return;
        }

        this.increaseMinute();
    }

    lightAction() {
        if (!this.isNightMode) {
            this.screen.setAttribute("style", "background-color: #313163");
            this.textElm.setAttribute("style", "color: aliceblue");
            this.isNightMode = true;
        }
        else {
            this.screen.setAttribute("style", "background-color: aliceblue");
            this.textElm.setAttribute("style", "color: #313163");
            this.isNightMode = false;
        }
    }

    resetClock() {
        this.initTimer();
    }

    changeHourMode() {
        this.is24HourMode = !this.is24HourMode;
        let value = Number(this.hour.textContent);
        if (this.is24HourMode) {
            if (this.hourMode.innerHTML === "PM")
                value = value + 12;
            this.hourMode.innerHTML = "";
            this.btnChangeModeHour.innerHTML = "Change To AM/PM";
        }
        else {
            this.hourMode.innerHTML = value >= 12 ? 'PM' : 'AM';
            this.btnChangeModeHour.innerHTML = "Change To 24h";
            value = value > 12 ? value - 12 : value;
        }
        this.clock.setHour(value);
        this.hour.textContent = this.normalize(value);
    }

    run() {
        let time = new Date();
        let isPassLimit = time.getSeconds() < this.clock.getSecond();
        this.second.textContent = this.normalize(time.getSeconds());
        if (this.second.textContent !== "00" || !isPassLimit)
            return;

        this.increaseMinute();
        if (this.minute.textContent !== "00")
            return;

        this.increaseHour();
    }
}
