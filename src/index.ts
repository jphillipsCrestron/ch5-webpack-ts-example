import './styles/main.scss';
import { 
    bridgeReceiveIntegerFromNative, 
    bridgeReceiveBooleanFromNative, 
    bridgeReceiveStringFromNative, 
    bridgeReceiveObjectFromNative,
    subscribeState,
    publishEvent
} from "@crestron/ch5-crcomlib";
import eruda from "eruda";

// Initialize eruda for debugging on the panel
eruda.init();

// Bridge CIP methods to the window object for CrComLib communication to work
(window as any)["bridgeReceiveIntegerFromNative"] = bridgeReceiveIntegerFromNative;
(window as any)["bridgeReceiveBooleanFromNative"] = bridgeReceiveBooleanFromNative;
(window as any)["bridgeReceiveStringFromNative"] = bridgeReceiveStringFromNative;
(window as any)["bridgeReceiveObjectFromNative"] = bridgeReceiveObjectFromNative;

////// Sending and receiving joins from processor
//// Digital
const sendDigitalButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendDigitalButton");
const currentDigitalValue: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentDigitalValue");
let savedBoolean: boolean = false;

// Receive
subscribeState('b', '1', (value: boolean) => {
    savedBoolean = value;
    currentDigitalValue.innerText = value.toString();
});

sendDigitalButton.addEventListener('click', handleSendDigital);

// Send
function handleSendDigital(): void {
    publishEvent('b', '1', !savedBoolean);
}

//// Analog
const sendAnalogButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendAnalogButton");
const currentAnalogValue: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentAnalogValue");
const analogSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("analogSlider");

// Receive
subscribeState('n', "1", (value: number) => { 
    let stringValue = value.toString();
    currentAnalogValue.innerText = stringValue;
    analogSlider.value = stringValue;
});

analogSlider.addEventListener('input', handleSliderChange);
sendAnalogButton.addEventListener('click', handleSendAnalog);

function handleSliderChange(): void {
    currentAnalogValue.innerText = analogSlider.value;
};

// Send
function handleSendAnalog(): void {
    publishEvent('n', '1', parseInt(analogSlider.value, 10));
}

//// Serial
const sendSerialButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendSerialButton");
const currentSerialValue: HTMLInputElement = <HTMLInputElement>document.getElementById("currentSerialValue");

// Receive
subscribeState('s', "1", (value: string) => {
    currentSerialValue.value = value;
});

sendSerialButton.addEventListener('click', handleSendSerial);
currentSerialValue.onkeydown = function(e: KeyboardEvent) {
    let keyCode = e.code || e.key;

    if (keyCode == 'Enter') {
        handleSendSerial();
        return false;
    }
}

// Send
function handleSendSerial(): void {
    publishEvent('s', '1', currentSerialValue.value);
}