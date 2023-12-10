import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';

const { isActive, WebXPanel, WebXPanelConfigParams, WebXPanelEvents } = getWebXPanel(!runsInContainerApp());

// Initialize WebXPanel if this is an xpanel instead of a panel/mobile project
if(isActive) {
    WebXPanelConfigParams.host = '0.0.0.0';
    WebXPanelConfigParams.ipId = '0x03';
    WebXPanelConfigParams.roomId = '1';

    console.log(`Initializing WebXPanel with config: ${JSON.stringify(WebXPanelConfigParams)}`);
    WebXPanel.initialize(WebXPanelConfigParams);

    const connectWsListener = () => {
        console.log("WebXPanel websocket connection success");
    };

    const errorWsListener = ({ detail }: any) => {
        console.log(`WebXPanel websocket connection error: ${JSON.stringify(detail)}`);
    };

    const connectCipListener = () => {
        console.log("WebXPanel CIP connection success");
    };

    const authenticationFailedListener = ({ detail }: any) => {
        console.log(`WebXPanel authentication failed: ${JSON.stringify(detail)}`);
    };

    const notAuthorizedListener = ({ detail }: any) => {
        console.log(`WebXPanel not authorized: ${JSON.stringify(detail)}`);
    window.location = detail.redirectTo;
    };

    const disconnectWsListener = ({ detail }: any) => {
        console.log(`WebXPanel websocket connection lost: ${JSON.stringify(detail)}`);
    };

    const disconnectCipListener = ({ detail }: any) => {
        console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
    };

    // Add XPanel event listeners
    window.addEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
    window.addEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
    window.addEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
    window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
    window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
    window.addEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
    window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);
}