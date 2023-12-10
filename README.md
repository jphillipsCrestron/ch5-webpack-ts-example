# CH5 example using Webpack and TypeScript

This project is a minimal demonstration of using CH5 (Crestron HTML5) functionality in a Webpack & TypeScript project

## Requirements
 - You must have Node.js 20.04.0 or higher and NPM 9.7.2 or higher. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)
 - The control system must have SSL enabled with authentication credentials created. For more information see [Control System Configuration](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-Settings.htm)
 - At the time of writing CH5 projects are only supported on 3 and 4-series processors (including VC-4), TST-1080, X60, and X70 panels, and the Crestron One app. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)

## Usage

Run `npm i` to install all dependencies.

Run the `build` script to build the project.

Run the `deploy:mobile` script to upload the .ch5z to the control system as a mobile project. Adjust the IP address to match your control system.

Run the `deploy:panel` script to upload the .ch5z to a touch panel as local project. Adjust the IP address to match your panel.

Run the `deploy:xpanel` script to upload the .ch5z to the control system as a WebXPanel. Adjust the IP address to match your control system.

## The entry point

The entry point is where the Crestron libraries will be loaded into the application. In this demo src/index.ts is treated as the entry point for the Crestron libraries.

### Initialize the WebXPanel library if running in a browser:
```ts
    import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';

    const { isActive, WebXPanel, WebXPanelConfigParams, WebXPanelEvents } = getWebXPanel(!runsInContainerApp());

    if(isActive) {
        WebXPanelConfigParams.host = '0.0.0.0';
        WebXPanelConfigParams.ipId = '0x03';
        WebXPanelConfigParams.roomId = '1';

        console.log(`Initializing WebXPanel with config: ${JSON.stringify(WebXPanelConfigParams)}`);
        WebXPanel.initialize(WebXPanelConfigParams);
    }
```

### Receive data via joins from the control system:
```ts
    window.CrComLib.subscribeState('b', '1', (value: boolean) => {
        // Listens for digital 1 from the processor
    });

    window.CrComLib.subscribeState('n', '1', (value: number) => {
        // Listens for analog 1 from the processor
    });

    window.CrComLib.subscribeState('s', '1', (value: string) => {
        // Listens for serial 1 from the processor
    });
```

### Send data via joins to the control system:
```ts
  const sendDigital = (value: boolean) => window.CrComLib.publishEvent('b', '1', value);
  const sendAnalog = (value: number) => window.CrComLib.publishEvent('n', '1', value);
  const sendSerial = (value: string) => window.CrComLib.publishEvent('s', '1', value);
```