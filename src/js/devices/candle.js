var SERVICE_UUID = ''
var CHARACTERISTIC_UUID = ''

export class CandleDevice {
  constructor(device) {
    this.device = device
    this.characteristic = null
  }

  static nameMatch(deviceName) {
    return /^CANDLE?$/.test(deviceName)
  }

  static serviceUUID() {
    return SERVICE_UUID
  }


  connect() {
    var bluetoothDevice = this.device
    console.log('Connecting to Bluetooth Device...');
    return bluetoothDevice.gatt.connect()
      .then(server => {
        return server.getPrimaryService(KIIROO_SERVICE);
      })
      .then(service => {
        console.log('Getting Characteristics...');
        return service.getCharacteristics();
      })
      .then(characteristics => {
        characteristics.forEach(characteristic => {
          //console.log('Characteristic: ' + characteristic.uuid);
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

  write(value) {
    var arr = [value] // TODO fix it
    console.log(arr)
    var bytes = new Uint8Array(arr)
    this.characteristic.writeValue(bytes)
      .then(() => {
        console.log('Written')
      }).catch(error => {
        console.log('Error', error)
      })
  }
}