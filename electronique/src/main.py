headers = {"Content-Type": "application/json"}

#---------- imports ----------------

from machine import ADC, Pin, I2C
import time
import network
import utime
import urequests
import json
import math

from gy521_pitch import get_pitch_and_roll
from mpu6050 import init_mpu6050


#---------- environnement variables -----------

from env import SSID, PASSWORD, data_interval, api_ip_address, probe_id, probe_password, calibration_mode, func_param_a, func_param_b, func_param_c

# Pins of the raspberry pi Pico to wich the GY-521 is connected
scl_pin = Pin(1)
sda_pin = Pin(0)

#---------- pin variables and communications --------------

adc_pin = ADC(Pin(26)) #ADC pin for temperature measure


# ----------- functions -----------------

def measure_temp():
    """
    Measures temperature in degress Celsius 
    """
    value = adc_pin.read_u16()
    mv = 3300.0 * value / 65535
    temp = (mv-500)/10
    
    return temp


def sending_data(send_timestamp, probe_id, float_density):
    """

    """
    try:
        with open("data.json", "r") as file:
            data = json.load(file)
    except OSError as e:
        return False
    
    
    payload = {
        "send_timestamp": send_timestamp,
        "probe_id": probe_id,
        "probe_password": probe_password
    }
    
    # Unpack the content of 'data' dictionary into 'payload'
    payload.update(data)
    payload_str = json.dumps(payload)
    #url = "http://"+api_ip_address+":3001/data/send_data"
    url = "https://"+api_ip_address+":8443/data/send_data"
    
    response = urequests.post(url, headers=headers, data=payload_str)

    
    number_of_saved_data = len(response.json())
    if(response.text == "Wrong password"):
        number_of_saved_data = 0
        print("wrong password for your probe")
    
    else:
        number_of_saved_data = len(response.json())
        
    response.close()

    
    return(number_of_saved_data)
    


def store_data(timestamp, temperature, float_density, refract_density):
    
    timestamp = " ".join(str(i) for i in timestamp)
    # Create a dictionary with the new data
    data = {
        timestamp: {
            "temperature": temperature,
            "float_density": float_density,
            "refract_density": refract_density
        }
    }

    # Load existing data from the JSON file, if it exists
    try:
        with open("data.json", "r") as file:
            existing_data = json.load(file)
    except OSError as e:
        return False

    # Merge the new data with existing data
    existing_data.update(data)
    # Save the updated data back to the JSON file
    with open("data.json", "w") as file:
        json.dump(existing_data, file)

    return True



def delete_oldest_records(num_records):
    # Load existing data from the JSON file
    try:
        with open("data.json", "r") as file:
            existing_data = json.load(file)
    except FileNotFoundError:
        return False
    
    # Find the oldest records to remove
    timestamps = [key for key in existing_data.keys()]
    timestamps.sort()
    timestamps_to_remove = timestamps[:num_records]
    
    # Remove the oldest records from the existing data
    for timestamp in timestamps_to_remove:
        del existing_data[timestamp]

    # Save the updated data back to the JSON file
    with open("data.json", "w") as file:
        json.dump(existing_data, file)

    return True
    


# ----------- wifi connection ------------


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID,PASSWORD)
print("Connecting")

while(not wlan.isconnected()):
    #wlan.connect(SSID,PASSWORD)
    time.sleep(1)
    
    
print("Probe is connected to the internet")

#print(wlan.isconnected())
#print(wlan.ifconfig())


#-------------- While loop -----------------

rtc=machine.RTC()

while True:
    #print(wlan.isconnected())
    if wlan.isconnected() == False :
        print("Probe is not connected to the internet")
        time.sleep(3)
        continue
        
        
    # calculating data
    temperature = measure_temp()
    pitch, roll = get_pitch_and_roll(scl_pin, sda_pin)
    flottation_plaato = func_param_a*(pitch)**2 + func_param_b*pitch + func_param_c # changing pitch angle (pos., neg. ?) -> depending on the tests and orientation of GY-521
    # specific gravity : SG = 1+ (plato / (258.6 – ( (plato/258.2) *227.1) ) )
    flottation_density = 1 +(flottation_plaato / (258.6 - ((flottation_plaato/258.2) * 227.1)))
    
    
    if calibration_mode == True :
        # sending data (pitch)
        payload = {
            "pitch" : roll, # pitch of the probe is roll of the GY-521 (depends on how it is placed)
            "probe_id": probe_id,
            "probe_password": probe_password
        }
    
        payload_str = json.dumps(payload)
        #url = "http://"+api_ip_address+":3001/data/send_calibration_data"
        url = "https://"+api_ip_address+":8443/data/send_calibration_data"
        response = urequests.post(url, headers=headers, data=payload_str)
        response.close()
        time.sleep(3)

        continue
    
    
    timestamp=rtc.datetime()
    timestamp = timestamp[0:3]+timestamp[4:7]

    send_timestamp = rtc.datetime()
    send_timestamp = send_timestamp[0:3]+send_timestamp[4:7]
    
    
    # storing, sending and deleting data
    store_data(timestamp, temperature, flottation_density, 0)
    number_of_saved_data = sending_data(send_timestamp, probe_id, flottation_density)
    delete_oldest_records(number_of_saved_data)

    #time.sleep(data_interval*60)
    time.sleep(data_interval*6)
    