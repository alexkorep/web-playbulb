/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var SERVICE_UUID = '0000ff02-0000-1000-8000-00805f9b34fb'
//var CHARACTERISTIC_UUID = '0000fffb-0000-1000-8000-00805f9b34fb'
var CHARACTERISTIC_UUID = '0000fffc-0000-1000-8000-00805f9b34fb'

function byteLimit(value) {
  return Math.round(Math.min(Math.max(parseInt(value), 0), 255))
}

class CandleDevice {
  constructor(device) {
    this.device = device
    this.characteristic = null
    this.server = null
  }

  static nameMatch(deviceName) {
    return /^PLAYBULB CANDLE?$/.test(deviceName)
  }

  static serviceUUIDs() {
    return [SERVICE_UUID, 'battery_service']
  }


  connect() {
    var bluetoothDevice = this.device
    console.log('Connecting to Bluetooth Device...');
    return bluetoothDevice.gatt.connect()
      .then(server => {
        this.server = server
        return server.getPrimaryService(SERVICE_UUID);
      })
      .then(service => {
        console.log('Getting Characteristics...');
        return service.getCharacteristics();
      })
      .then(characteristics => {
        characteristics.forEach(characteristic => {
          switch (characteristic.uuid) {
            case CHARACTERISTIC_UUID:
              this.characteristic = characteristic
              console.log('Found characteristic')
              break;
            default:
              break;
          }
        })
      })
  }

  setColor(red, green, blue, saturation) {
    var arr = [
      byteLimit(saturation),
      byteLimit(red),
      byteLimit(green),
      byteLimit(blue)
    ]
    var bytes = new Uint8Array(arr)
    return this.characteristic.writeValue(bytes)
  }

  getBatteryLevel() {
    if (!this.server) {
      return Promise.reject('Bluetooth device is not connected')
    }

    console.log('Getting Battery Service...');
    return this.server.getPrimaryService('battery_service')
      .then(service => {
        console.log('Getting Battery Level Characteristic...')
        return service.getCharacteristic('battery_level')
      })
      .then(characteristic => {
        console.log('Reading Battery Level...')
        return characteristic.readValue();
      }).then(value => {
        let batteryLevel = value.getUint8(0);
        console.log('Battery Level:', batteryLevel)
        return batteryLevel
      })
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CandleDevice;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__devices_candle__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["ConnectDevice"] = ConnectDevice;


function ConnectDevice () {
  var serviceUUIDs = __WEBPACK_IMPORTED_MODULE_0__devices_candle__["a" /* CandleDevice */].serviceUUIDs()
  var options = {
    acceptAllDevices: true,
    optionalServices: serviceUUIDs,
  }
  var bluetoothDevice = null

  return navigator.bluetooth.requestDevice(options)
    .then(device => {
      //device.addEventListener('gattserverdisconnected', onDisconnected);
      var deviceObject = null
      if (__WEBPACK_IMPORTED_MODULE_0__devices_candle__["a" /* CandleDevice */].nameMatch(device.name)) {
        deviceObject = new __WEBPACK_IMPORTED_MODULE_0__devices_candle__["a" /* CandleDevice */](device)
      } else {
        return false
      }

      return deviceObject.connect().then(() => {
          return new Promise(resolve => resolve(deviceObject))
      })
    })
}

window.ConnectDevice = ConnectDevice


/***/ })
/******/ ]);