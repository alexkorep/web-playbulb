var SERVICE_UUID = '0000ff02-0000-1000-8000-00805f9b34fb'
//var CHARACTERISTIC_UUID = '0000fffb-0000-1000-8000-00805f9b34fb'
var CHARACTERISTIC_UUID = '0000fffc-0000-1000-8000-00805f9b34fb'

export class CandleDevice {
  constructor(device) {
    this.device = device
    this.characteristic = null
  }

  static nameMatch(deviceName) {
    return /^PLAYBULB CANDLE?$/.test(deviceName)
  }

  static serviceUUID() {
    return SERVICE_UUID
  }


  connect() {
    var bluetoothDevice = this.device
    console.log('Connecting to Bluetooth Device...');
    return bluetoothDevice.gatt.connect()
      .then(server => {
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
        Math.round(saturation % 256),
        Math.round(red % 256),
        Math.round(green % 256),
        Math.round(blue % 256)]
    var bytes = new Uint8Array(arr)
    return this.characteristic.writeValue(bytes)
  }
}