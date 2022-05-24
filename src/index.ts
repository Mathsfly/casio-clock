import './index.css';
import { createElement } from './util/htlm-element-util';
import { ClockController } from './controler/clock-controller';

class App {
  run() {
    var clockController = new ClockController();
    var label = createElement(document.body, "label", "GMT offset: ");
    label.setAttribute('for', 'input_text');
    var input_text = createElement(document.body, "input", undefined, "undefined", "input_text");
    (<HTMLInputElement>input_text).defaultValue = '0';
    input_text.setAttribute('type', 'number');
    input_text.setAttribute('min', '-11');
    input_text.setAttribute('max', '12');

    var add_button = createElement(document.body, "button", "add New Clock", "button add", "ok");
    var message = createElement(document.body, "div", "Message: Select a GMT", "message", "userMsg");
    if (add_button)
      add_button.addEventListener("click", () => {
        var res = clockController.addClock(Number((<HTMLInputElement>input_text).value));
        
        //message 
        if (!res) {
          message.innerHTML = "Warning: This GMT has already exits";
          message.setAttribute('style', 'color: red;')
        }
        else {
          message.innerHTML = "Info: New clock added";
          message.setAttribute('style', 'color: green');
        }
      });
  };
}


var app = new App();
window.onload = () => {
  app.run();
}
