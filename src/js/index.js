import { CandleDevice } from './devices/candle'

export function ConnectDevice () {
  var options = {
    acceptAllDevices: true,
    optionalServices: [
      CandleDevice.serviceUUID(),
    ],
  }
  var bluetoothDevice = null

  return navigator.bluetooth.requestDevice(options)
    .then(device => {
      //device.addEventListener('gattserverdisconnected', onDisconnected);
      var deviceObject = null
      if (CandleDevice.nameMatch(device.name)) {
        deviceObject = new CandleDevice(device)
      } else {
        return false
      }

      return deviceObject.connect().then(() => {
        return deviceObject
      })
    })
}
