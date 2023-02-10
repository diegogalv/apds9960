/**
 * makecode APDS9930 Digital Proximity and Ambient Light Sensor package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

const APDS9960_ADDRESS = 0x39
const APDS9960_ENABLE = 0x80
const APDS9960_ATIME = 0x81
const APDS9960_WTIME = 0x83
const APDS9960_AILTIL = 0x84
const APDS9960_AILTH = 0x85
const APDS9960_AIHTL = 0x86
const APDS9960_AIHTH = 0x87
const APDS9960_PILT = 0x89
const APDS9960_PIHT = 0x8B
const APDS9960_PERS = 0x8C
const APDS9960_CONFIG1 = 0x8D
const APDS9960_PPULSE = 0x8E
const APDS9960_CONTROL = 0x8F
const APDS9960_CONFIG2 = 0x90
const APDS9960_ID = 0x92
const APDS9960_STATUS = 0x93
const APDS9960_CDATAL = 0x94
const APDS9960_CDATAH = 0x95
const APDS9960_RDATAL = 0x96
const APDS9960_RDATAH = 0x97
const APDS9960_GDATAL = 0x98
const APDS9960_GDATAH = 0x99
const APDS9960_BDATAL = 0x9A
const APDS9960_BDATAH = 0x9B
const APDS9960_PDATA = 0x9C
const APDS9960_POFFSET_UR = 0x9D
const APDS9960_POFFSET_DL = 0x9E
const APDS9960_CONFIG3 = 0x9F
const APDS9960_GPENTH = 0xA0
const APDS9960_GEXTH = 0xA1
const APDS9960_GCONF1 = 0xA2
const APDS9960_GCONF2 = 0xA3
const APDS9960_GOFFSET_U = 0xA4
const APDS9960_GOFFSET_D = 0xA5
const APDS9960_GOFFSET_L = 0xA7
const APDS9960_GOFFSET_R = 0xA9
const APDS9960_GPULSE = 0xA6
const APDS9960_GCONF3 = 0xAA
const APDS9960_GCONF4 = 0xAB
const APDS9960_GFLVL = 0xAE
const APDS9960_GSTATUS = 0xAF
const APDS9960_IFORCE = 0xE4
const APDS9960_PICLEAR = 0xE5
const APDS9960_CICLEAR = 0xE6
const APDS9960_AICLEAR = 0xE7
const APDS9960_GFIFO_U = 0xFC
const APDS9960_GFIFO_D = 0xFD
const APDS9960_GFIFO_L = 0xFE
const APDS9960_GFIFO_R = 0xFF

/**
 * set APDS9930's reg
 */
function set2Reg(command: number): number {
    let buf = pins.createBuffer(2);
    // basic.pause(10)
    // basic.pause(10)
    buf[1] = command >> 8
    buf[0] = command & 0xFF
    return pins.i2cWriteBuffer(APDS9960_ADDRESS, buf)
}

function setReg(reg: number, dat: number): void {
    let _wbuf = pins.createBuffer(2);
    _wbuf[0] = reg | 0xFF;
    _wbuf[1] = dat;
    pins.i2cWriteBuffer(APDS9960_ADDRESS, _wbuf);
}

function read_buf_8(cmd: number): number {
    let i2cbuf = pins.i2cReadBuffer(APDS9960_ADDRESS, pins.sizeOf(NumberFormat.UInt8BE) * 7, false)
    let result = i2cbuf[0] << 8;
    result |= i2cbuf[1];
    //basic.pause(10)
    return result

}



function getReg(reg: number): number {
    pins.i2cWriteNumber(APDS9960_ADDRESS, reg, NumberFormat.UInt8BE);
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.UInt8BE);
    
}


    /**
     * Power On
     */

function PowerOn() {
    let t = getReg(APDS9960_ENABLE)
    t &= 0b00000001
    setReg(APDS9960_ENABLE, t)
    basic.pause(3)
}
    /**
     * ALS Enable
     * @param en is enable/disable ALS, eg: true
     */

function ALSEnable(en: boolean = true) {
    let t = getReg(APDS9960_ENABLE)
    t &= 0b00000010
    //if (en) t |= 2
    setReg(APDS9960_ENABLE, t)
    basic.pause(10)
}
function WaitEnable(en: boolean = true) {
    let t = getReg(APDS9960_ENABLE)
    t &= 0b00001000
    //if (en) t |= 4
    setReg(APDS9960_ENABLE, t)
    basic.pause(10)
}

    /**
     * Initialize
     */
    //% blockId="APDS9960_INIT" block="APDS9960 Initialize"
    //% weight=210 blockGap=8
function init() {
    PowerOn()
    ALSEnable()
    setReg(APDS9960_ENABLE, 0)
    setReg(APDS9960_ATIME, 0xFF)
    setReg(APDS9960_WTIME, 0xFF)
    setReg(APDS9960_PERS, 0)
    //setReg(APDS9960_CONFIG1, 0X40)
    setReg(APDS9960_CONTROL, 0)  
    //WaitEnable(true)
    basic.pause(10)
}

/**
* APDS9930 mudule
*/
init();

basic.forever(()=>{
    let l = getReg(APDS9960_ENABLE);
    let m = getReg(APDS9960_STATUS);
    let c = getReg(APDS9960_CDATAL);
    let r = getReg(APDS9960_RDATAL);
    let g = getReg(APDS9960_GDATAL);
    let b = getReg(APDS9960_BDATAL);
    


    //serial.writeNumber(r)
    //basic.pause(100)


    //}
    /* This only uses RGB ... how can we integrate clear or calculate lux */
    /* based exclusively on clear since this might be more reliable?      */
    //let illuminance = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
    basic.showNumber(l)
    //basic.pause(1000)
    //basic.showNumber(g)
})
    

