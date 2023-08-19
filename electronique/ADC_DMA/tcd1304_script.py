import time, array, uctypes, rp_devices as devs
from machine import ADC, Pin, I2C, PWM


ADC_CHAN = 0
ADC_PIN  = 27 + ADC_CHAN


adc = devs.ADC_DEVICE
pin = devs.GPIO_PINS[ADC_PIN]
pad = devs.PAD_PINS[ADC_PIN]
pin.GPIO_CTRL_REG = devs.GPIO_FUNC_NULL
pad.PAD_REG = 0

adc.CS_REG = adc.FCS_REG = 0
adc.CS.EN = 1
adc.CS.AINSEL = ADC_CHAN


transistor_pin = Pin(16, Pin.OUT)
tcd_output_pin = ADC(Pin(27))

transistor_pin.value(0)
time.sleep(1)
transistor_pin.value(1)
time.sleep(1)

print(tcd_output_pin.read_u16())
#print(tcd_output_pin.read_uv()) #not working

MLCK_clock = PWM(Pin(17))
SH_clocke = PWM(Pin(18))
ICG_clock = PWM(Pin(19))

MLCK_clock.freq(2000000)
SH_clocke.freq(200)
ICG_clock.freq(100000)


# Multiple ADC samples using DMA
DMA_CHAN = 0
NSAMPLES = 50 # nombre de valeurs à récup ?
RATE = 100000
dma_chan = devs.DMA_CHANS[DMA_CHAN]
dma = devs.DMA_DEVICE


adc.FCS.EN = adc.FCS.DREQ_EN = 1
adc_buff = array.array('H', (0 for _ in range(NSAMPLES)))
adc.DIV_REG = (48000000 // RATE - 1) << 8
adc.FCS.THRESH = adc.FCS.OVER = adc.FCS.UNDER = 1

dma_chan.READ_ADDR_REG = devs.ADC_FIFO_ADDR
dma_chan.WRITE_ADDR_REG = uctypes.addressof(adc_buff)
dma_chan.TRANS_COUNT_REG = NSAMPLES

dma_chan.CTRL_TRIG_REG = 0
dma_chan.CTRL_TRIG.CHAIN_TO = DMA_CHAN
dma_chan.CTRL_TRIG.INCR_WRITE = dma_chan.CTRL_TRIG.IRQ_QUIET = 1
dma_chan.CTRL_TRIG.TREQ_SEL = devs.DREQ_ADC
dma_chan.CTRL_TRIG.DATA_SIZE = 1
dma_chan.CTRL_TRIG.EN = 1

print("out")
print(adc.FCS.LEVEL)
while adc.FCS.LEVEL:
    print("in")
    x = adc.FIFO_RE

    
adc.CS.START_MANY = 1
while dma_chan.CTRL_TRIG.BUSY:
    time.sleep_ms(10)
    
adc.CS.START_MANY = 0

# RETRIEVING DATA THAT HAS BEEN ADDED SINCE START -> necessary ?
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG
x = adc.FIFO_REG

print(adc.FCS.LEVEL)
dma_chan.CTRL_TRIG.EN = 0
vals = [("%1.3f" % (val*3.3/4096)) for val in adc_buff]
print(vals)
print(len(vals))
print(adc_buff)
print(len(adc_buff))


print(f"{adc.FCS.LEVEL=} {adc.FCS.OVER=}")

#print(adc.FIFO_REG)
#print(adc.FIFO_REG)
#print(adc.FIFO_REG)
#print(adc.FIFO_REG)
#print(adc.FIFO_REG)
#print(adc.FIFO_REG)

#print(f"{adc.FCS.LEVEL=} {adc.FCS.OVER=}")


# Stop PWM
MLCK_clock.deinit()
SH_clocke.deinit()
ICG_clock.deinit()
transistor_pin.value(0)


        
