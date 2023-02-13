function getReg_int (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_ADDRESS,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.Int8LE, false)
}
function PowerOff () {
    u = getReg(APDS9960_ENABLE)
    u &= 0xFE
setReg(APDS9960_ENABLE, u)
}
// WaitEnable(true)
function init () {
    // ATIME(256 - 8)
    // setReg(APDS9960_ENABLE, 0)
    setReg(APDS9960_ATIME, 255)
    basic.pause(10)
    setReg(APDS9960_WTIME, 255)
    // setReg(APDS9960_PERS, 0x22)
    basic.pause(10)
    setReg(APDS9960_CONFIG1, 64)
    // setReg(APDS9930_PPULSE, 8)
    // setReg(APDS9960_CONTROL, 0x2C)
    basic.pause(10)
    PERS_REG(true)
basic.pause(10)
    GAIN(true);
basic.pause(10)
    ALSEnable(true)
basic.pause(10)
    PowerOn()
}
// get a reg
function getReg (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_ADDRESS,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.UInt8BE, false)
}
// set APDS9960's reg
function setReg (reg: number, dat: number) {
    let _wbuf = pins.createBuffer(2);
_wbuf[0] = reg
    _wbuf[1] = dat
    pins.i2cWriteBuffer(APDS9960_ADDRESS, _wbuf);
}
function PowerOn () {
    t = getReg(APDS9960_ENABLE)
    t |= 1
setReg(APDS9960_ENABLE, t)
    basic.pause(3)
}
// get two reg, UInt16LE format
function get2Reg (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_ADDRESS,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.Int16BE, false)
}
let t = 0
let u = 0
let APDS9960_CONFIG1 = 0
let APDS9960_WTIME = 0
let APDS9960_ATIME = 0
let APDS9960_ENABLE = 0
let APDS9960_ADDRESS = 0
APDS9960_ADDRESS = 57
APDS9960_ENABLE = 128
APDS9960_ATIME = 129
APDS9960_WTIME = 131
let APDS9960_AILTIL = 132
let APDS9960_AILTH = 133
let APDS9960_AIHTL = 134
let APDS9960_AIHTH = 135
let APDS9960_PILT = 137
let APDS9960_PIHT = 139
let APDS9960_PERS = 140
APDS9960_CONFIG1 = 141
let APDS9960_PPULSE = 142
let APDS9960_CONTROL = 143
let APDS9960_CONFIG2 = 144
let APDS9960_ID = 146
let APDS9960_STATUS = 147
let APDS9960_CDATAL = 148
let APDS9960_CDATAH = 149
let APDS9960_RDATAL = 150
let APDS9960_RDATAH = 151
let APDS9960_GDATAL = 152
let APDS9960_GDATAH = 153
let APDS9960_BDATAL = 154
let APDS9960_BDATAH = 155
function ALSEnable(en: boolean = true) {
    let v = getReg(APDS9960_ENABLE)
    v &= 0x13
    if (en) v |= 19
    setReg(APDS9960_ENABLE, v)
}
function GAIN(en: boolean = true) {
    let w = getReg(APDS9960_CONTROL)
    w &= 0xFD
    if (en) w |= 2
    setReg(APDS9960_CONTROL, w)
}
function PERS_REG(en: boolean = true) {
    let a = getReg(APDS9960_PERS)
    a &= 0x02
    if (en) a |= 1
    setReg(APDS9960_PERS, a)
}
namespace CIP_APDS9960 {
    let illuminance = 0
    init();
    /**
     * Returns a number describing the lux 
    */
    //% blockId="APDS9960_read_LUX"
    //% block="leer lux"
    export function leer_lux(): number {
        //let G = getReg(APDS9960_CONTROL)
        let TL = get2Reg(APDS9960_AILTIL);
        let TH = get2Reg(APDS9960_AIHTH);
        let LH = get2Reg(APDS9960_AILTH);
        let HL = get2Reg(APDS9960_AIHTL);
        //let l = getReg(APDS9960_STATUS);
        let c = get2Reg(APDS9960_CDATAL);
        basic.pause(10)
        if ((c >= TH + LH) || (c <= TL + HL)) {
            let r = get2Reg(APDS9960_RDATAL);
            let g = get2Reg(APDS9960_GDATAL);
            let b = get2Reg(APDS9960_BDATAL);
            illuminance = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
            illuminance = illuminance/ 255
            if (illuminance < 0) illuminance = Math.abs(illuminance)
        }
        return illuminance

    }
}
