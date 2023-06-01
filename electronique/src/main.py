
headers = {"Content-Type": "application/json"}

#---------- imports ----------------

from machine import ADC, Pin
import time
import network
import utime
#import secrets
import urequests
import json




#---------- environnement variables -----------

from env import SSID, PASSWORD, data_interval, api_ip_address, probe_id



#---------- pin variables --------------

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


def sending_data(send_timestamp, probe_id, timestamp, temp):
    """

    """
    payload = { 
    "send_timestamp":send_timestamp,
    "probe_id": probe_id,
    "data_timestamp": timestamp,
    "temperature": temp,
    "float_density": 0,
    "refract_density": 0  
    }
    
    payload_str = json.dumps(payload)
    url = "http://"+api_ip_address+":3001/send_data"
    
    response = urequests.post(url, headers=headers, data=payload_str)
    
    print(response)
    response.close()
    

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
            print(existing_data)
    except OSError as e:
        if e.args[0] == 2:  # File not found error
            existing_data = {}
        else:
            raise
        return False

    # Merge the new data with existing data
    existing_data.update(data)
    print(existing_data)

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
        existing_data = {}
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

print(wlan.isconnected())
print(wlan.ifconfig())


#-------------- While loop -----------------

rtc=machine.RTC()

while True:
    # code
    temperature = measure_temp()
    
    timestamp=rtc.datetime()
    timestamp = timestamp[0:3]+timestamp[4:7]

    send_timestamp = rtc.datetime()
    send_timestamp = send_timestamp[0:3]+send_timestamp[4:7]
    
    sending_data(send_timestamp, probe_id, timestamp, temperature)
    store_data(timestamp, temperature, 0, 0)
    
    time.sleep(data_interval*60)