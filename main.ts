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
const APDS9960_CONTROL = 0x8F
const APDS9960_STATUS = 0x93
const APDS9960_CDATAL = 0x94
const APDS9960_CDATAH = 0x95
const APDS9960_RDATAL = 0x96
const APDS9960_RDATAH = 0x97
const APDS9960_GDATAL = 0x98
const APDS9960_GDATAH = 0x99
const APDS9960_BDATAL = 0x9A
const APDS9960_BDATAH = 0x9B


/**
   * set APDS9960's reg
   */
function set_Reg_lux(reg: number, dat: number): void {
    _wbuf[0] = reg;
    _wbuf[1] = dat;
    pins.i2cWriteBuffer(APDS9960_ADDRESS, _wbuf);
}

/**
 * get a reg
 */
function get_Reg_lux(reg: number): number {
    pins.i2cWriteNumber(APDS9960_ADDRESS, reg, NumberFormat.UInt16BE);
    basic.pause(3)
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.UInt16BE);
}

/**
 * get two reg, UInt16LE format
 */
function get2Reg_lux(reg: number): number {
    pins.i2cWriteNumber(APDS9960_ADDRESS, reg, NumberFormat.UInt8BE);
    basic.pause(3)
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.UInt16BE);
}

function get_final(reg: number): number {
    pins.i2cWriteNumber(APDS9960_ADDRESS, reg, NumberFormat.UInt8BE);
    basic.pause(3)
    return pins.i2cReadNumber(APDS9960_ADDRESS, NumberFormat.UInt16LE);
}


function PowerOn() {
    let t = get2Reg_lux(APDS9960_ENABLE)
    t |= 1
    set_Reg_lux(APDS9960_ENABLE, t)
    basic.pause(3)
}


function ALSEnable(en: boolean = true) {
    let t = get2Reg_lux(APDS9960_ENABLE)
    t &= 0x00
    if (en) t |= 15
    set_Reg_lux(APDS9960_ENABLE, t)
    basic.pause(3)
}

function GAIN(en: boolean = true) {
    let t = get2Reg_lux(APDS9960_CONTROL)
    t &= 0xFD
    if (en) t |= 2
    set_Reg_lux(APDS9960_CONTROL, t)
    basic.pause(3)
}

let _wbuf = pins.createBuffer(2);
//% color=#4c6ef5 weight=25 icon="\uf043" block="APDS9960"
namespace CIP_APDS9960 {
    
    let illuminance = 0
    //set_Reg_lux(APDS9960_ATIME, 0xFF)
    //set_Reg_lux(APDS9960_WTIME, 0xFF)
    //set_Reg_lux(APDS9960_CONFIG1, 0X40)
    ALSEnable(true);
    PowerOn()
    GAIN(true);
    /**
     * Returns a number describing the lux 
    */
    //% blockId="APDS9960_read_LUX"
    //% block="leer lux"
    export function leer_lux(): number {
        //let G = getReg(APDS9960_CONTROL)
        let TL = get_Reg_lux(APDS9960_AILTIL);
        let TH = get_Reg_lux(APDS9960_AIHTH);
        let LH = get_Reg_lux(APDS9960_AILTH);
        let HL = get_Reg_lux(APDS9960_AIHTL);
        let l = get_final(APDS9960_STATUS);
        let c = get_final(APDS9960_CDATAL);
        basic.pause(10)
        if ((c >= TH + LH) || (c <= TL + HL)) {
            let r = get_final(APDS9960_RDATAL);
            let g = get_final(APDS9960_GDATAL);
            let b = get_final(APDS9960_BDATAL);
            illuminance = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
            illuminance = illuminance / 255
            Math.abs(illuminance)
        }
    return l

    }
}