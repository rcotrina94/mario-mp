var WEBRTC_KEVENT_NAME = 'external_key_event';
var WEBRTC_KEVENT = new CustomEvent(WEBRTC_KEVENT_NAME, {'keyCode':});

var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");

if(eventObj.initEvent){
	eventObj.initEvent("keydown", true, true);
}

eventObj.keyCode = keyCode;
eventObj.which = keyCode;

document.dispatchEvent ? document.dispatchEvent(eventObj) : document.fireEvent("onkeydown", eventObj);
