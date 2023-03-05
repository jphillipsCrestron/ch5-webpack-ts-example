import './styles/main.scss';
import * as CrComLib from "@crestron/ch5-crcomlib";
import WebXPanel, { 
    WebXPanelConfigParams,
    isActive,
} from "@crestron/ch5-webxpanel"; 
import eruda from "eruda";

// Initialize eruda for debugging on the panel
eruda.init();

// Bind CrComLib to the window object for XPanel to find it
(window as any)["CrComLib"] = CrComLib;

// Bind CIP methods to the window object for CrComLib communication to work
(window as any)["bridgeReceiveIntegerFromNative"] = CrComLib.bridgeReceiveIntegerFromNative;
(window as any)["bridgeReceiveBooleanFromNative"] = CrComLib.bridgeReceiveBooleanFromNative;
(window as any)["bridgeReceiveStringFromNative"] = CrComLib.bridgeReceiveStringFromNative;
(window as any)["bridgeReceiveObjectFromNative"] = CrComLib.bridgeReceiveObjectFromNative;

// Define XPanel connection settings
const xpanelConfig: Partial<WebXPanelConfigParams> = { 
    host: '192.168.1.87',
    ipId: '0x04',
    roomId: 'JPHILLIPS',
};

// Initialize WebXPanel if this is an xpanel instead of a panel/mobile project
if(isActive) {
    console.log("Initializing WebXPanel");
    WebXPanel.initialize(xpanelConfig);
}

////// Sending and receiving joins from processor
//// Digital
const sendDigitalButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendDigitalButton");
const currentDigitalValue: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentDigitalValue");
let savedBoolean: boolean = false;

// Receive
CrComLib.subscribeState('b', '1', (value: boolean) => {
    savedBoolean = value;
    currentDigitalValue.innerText = value.toString();
});

sendDigitalButton.addEventListener('click', handleSendDigital);

// Send
function handleSendDigital(): void {
    CrComLib.publishEvent('b', '1', !savedBoolean);
}

//// Analog
const sendAnalogButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendAnalogButton");
const currentAnalogValue: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentAnalogValue");
const analogSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("analogSlider");

// Receive
CrComLib.subscribeState('n', "1", (value: number) => { 
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
    CrComLib.publishEvent('n', '1', parseInt(analogSlider.value, 10));
}

//// Serial
const sendSerialButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendSerialButton");
const currentSerialValue: HTMLInputElement = <HTMLInputElement>document.getElementById("currentSerialValue");

// Receive
CrComLib.subscribeState('s', "1", (value: string) => {
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
    CrComLib.publishEvent('s', '1', currentSerialValue.value);
}