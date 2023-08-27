import time, array, uctypes, rp_devices as devs
from machine import ADC, Pin, I2C, PWM

# Using code from : https://github.com/jbentham/pico


# How to use :
#-----------------

#from tcd1304 import TCD1304

#tcd1304 = TCD1304()

#tcd1304.tcd1304_start()
#tcd1304.clock_start()
#values = tcd1304.reading()
#print(values)
#tcd1304.clock_stop()
#tcd1304.tcd1304_stop()



# vérifier fréquences clock tcd1304
class TCD1304():
    def __init__(self, adc_pin=27, dma_channel=0, samples=50, mlck_pin=17, sh_pin=18, icg_pin=19, mlck_freq=2000000, sh_freq=200, icg_freq=100000, start_pin=16):
        
        self.transistor_pin = Pin(start_pin, Pin.OUT) # pin commending the trasistor, which commands the tcd1304 Vcc
        
        self.MLCK_clock = PWM(Pin(mlck_pin))
        self.SH_clock = PWM(Pin(sh_pin))
        self.ICG_clock = PWM(Pin(icg_pin))
        
        self.mlck_freq = mlck_freq
        self.sh_freq = sh_freq
        self.icg_freq = icg_freq
        self.samples = samples
        self.dma_channel = dma_channel
        self.adc_pin = adc_pin
        
        
       # self.adc = devs.ADC_DEVICE
       # #pin and pad stored to apply parameters (pin.GPIO_CTRL_REG, pad.PAD_REG) afterwards
       # self.pin = devs.GPIO_PINS[adc_pin]
       # self.pad = devs.PAD_PINS[adc_pin]
       # self.pin.GPIO_CTRL_REG = devs.GPIO_FUNC_NULL
       # self.pad.PAD_REG = 0

       # self.adc.CS_REG = self.adc.FCS_REG = 0
       # self.adc.CS.EN = 1
       # self.adc.CS.AINSEL = adc_pin
        

       # self.dma_chan = devs.DMA_CHANS[dma_channel]
       # self.dma = devs.DMA_DEVICE

        

    def clock_start(self):
        self.MLCK_clock.freq(self.mlck_freq)
        self.SH_clock.freq(self.sh_freq)
        self.ICG_clock.freq(self.icg_freq)
        
    def clock_stop(self):
        self.MLCK_clock.deinit()
        self.SH_clock.deinit()
        self.ICG_clock.deinit()
        
    def tcd1304_start(self):
        self.transistor_pin.value(1)
        
    def tcd1304_stop(self):
        self.transistor_pin.value(0)
        
        
    def reading(self):
        # --------- Also in init ? ------------
        self.adc = devs.ADC_DEVICE
        #pin and pad stored to apply parameters (pin.GPIO_CTRL_REG, pad.PAD_REG) afterwards
        self.pin = devs.GPIO_PINS[self.adc_pin]
        self.pad = devs.PAD_PINS[self.adc_pin]
        self.pin.GPIO_CTRL_REG = devs.GPIO_FUNC_NULL
        self.pad.PAD_REG = 0

        self.adc.CS_REG = self.adc.FCS_REG = 0
        self.adc.CS.EN = 1
        self.adc.CS.AINSEL = 0  ############################ -> adc channel (0) ? not pin
        

        self.dma_chan = devs.DMA_CHANS[self.dma_channel]
        self.dma = devs.DMA_DEVICE
        
        RATE = 100000

        self.adc.FCS.EN = self.adc.FCS.DREQ_EN = 1
        self.adc_buff = array.array('H', (0 for _ in range(self.samples)))
        self.adc.DIV_REG = (48000000 // RATE - 1) << 8
        self.adc.FCS.THRESH = self.adc.FCS.OVER = self.adc.FCS.UNDER = 1

        self.dma_chan.READ_ADDR_REG = devs.ADC_FIFO_ADDR
        self.dma_chan.WRITE_ADDR_REG = uctypes.addressof(self.adc_buff)
        self.dma_chan.TRANS_COUNT_REG = self.samples

        self.dma_chan.CTRL_TRIG_REG = 0
        self.dma_chan.CTRL_TRIG.CHAIN_TO = self.dma_channel
        self.dma_chan.CTRL_TRIG.INCR_WRITE = self.dma_chan.CTRL_TRIG.IRQ_QUIET = 1
        self.dma_chan.CTRL_TRIG.TREQ_SEL = devs.DREQ_ADC
        self.dma_chan.CTRL_TRIG.DATA_SIZE = 1
        self.dma_chan.CTRL_TRIG.EN = 1

        # deleting old data in fifo memory
        while self.adc.FCS.LEVEL:
            x = self.adc.FIFO_RE
            
        # ---------------------------------------

            
        self.adc.CS.START_MANY = 1
        while self.dma_chan.CTRL_TRIG.BUSY:
            time.sleep_ms(10)
            
        self.adc.CS.START_MANY = 0

        #print(adc.FCS.LEVEL)
        self.dma_chan.CTRL_TRIG.EN = 0
        vals = [("%1.3f" % (val*3.3/4096)) for val in self.adc_buff]
        print(vals)
        error_message = f"{self.adc.FCS.LEVEL=} {self.adc.FCS.OVER=}"
        
        return(vals, error_message)
        #print(len(vals))
        #print(adc_buff)
        #print(len(adc_buff))


        print(f"{adc.FCS.LEVEL=} {adc.FCS.OVER=}")

        