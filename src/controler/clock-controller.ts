import { createElement } from "../util/htlm-element-util";
import { ClockView } from "../view";

export class ClockController {
    mapGmtClock: Map<number, ClockView>;
    parent: Element;

    constructor() {
        this.parent = createElement(document.body);
        var clock = new ClockView(2, this.parent);
        this.mapGmtClock = new Map([[2, clock]]);
    }

    addClock(gmt: number) {
        if (this.mapGmtClock.has(gmt))
            return false;

        var clock = new ClockView(gmt, this.parent);
        this.mapGmtClock.set(gmt, clock);
        return true;
    }

    removeClock(gmt: number){
        //To do
    }
}
