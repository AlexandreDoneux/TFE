
#---------- imports ----------------

from machine import ADC, Pin
import time
import network
#import secrets
import urequests


#---------- pin variables --------------

adc_pin = ADC(Pin(26)) #ADC pin for temperature measure


#---------- environnement variables -----------

from env import SSID, PASSWORD, data_interval



# ----------- functions -----------------

def measure_temp():
    """
    Measures temperature in degress Celsius 
    """
    value = adc_pin.read_u16()
    mv = 3300.0 * value / 65535
    temp = (mv-500)/10
    
    return temp


# ----------- wifi connection ------------


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID,PASSWORD)

print(wlan.isconnected())
print(wlan.ifconfig())


# Remplacer par appel vers API personelle
astronauts = urequests.get("http://api.open-notify.org/astros.json").json()
print(astronauts)

#-------------- While loop -----------------

while True:
    # code
    temperature = measure_temp()
    print(temperature)
    
    time.sleep(data_interval*60)