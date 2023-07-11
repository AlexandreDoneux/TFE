from machine import Pin, I2C
import utime
import math
from mpu6050 import init_mpu6050, get_mpu6050_data

i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
init_mpu6050(i2c)



def calculate_tilt_angles(accel_data):
    x, y, z = accel_data['x'], accel_data['y'], accel_data['z']
 
    tilt_x = math.atan2(y, math.sqrt(x * x + z * z)) * 180 / math.pi
    tilt_y = math.atan2(-x, math.sqrt(y * y + z * z)) * 180 / math.pi
    tilt_z = math.atan2(z, math.sqrt(x * x + y * y)) * 180 / math.pi
 
    return tilt_x, tilt_y, tilt_z
 
def complementary_filter(pitch, roll, gyro_data, dt, alpha=0.98):
    pitch += gyro_data['x'] * dt
    roll -= gyro_data['y'] * dt
 
    pitch = alpha * pitch + (1 - alpha) * math.atan2(gyro_data['y'], math.sqrt(gyro_data['x'] * gyro_data['x'] + gyro_data['z'] * gyro_data['z'])) * 180 / math.pi
    roll = alpha * roll + (1 - alpha) * math.atan2(-gyro_data['x'], math.sqrt(gyro_data['y'] * gyro_data['y'] + gyro_data['z'] * gyro_data['z'])) * 180 / math.pi

    
    return pitch, roll

#### WORKS better for pitch but
def get_pitch_alternate(accel_data):
    x, y, z = accel_data['x'], accel_data['y'], accel_data['z']
    
    pitch = math.atan(x/math.sqrt((y*y) + (z*z))); #pitch calculation
    pitch = pitch * (180.0/3.14); # radians to degrees
    
    return pitch


#### WORKS better for pitch but
def get_roll_alternate(accel_data):
    x, y, z = accel_data['x'], accel_data['y'], accel_data['z']
    
    roll = math.atan(y/math.sqrt((x*x) + (z*z))); #roll calculation
    roll = roll * (180.0/3.14); # radians to degrees
    
    return roll


def get_pitch_and_roll(scl_pin, sda_pin):
    i2c = I2C(0, scl=scl_pin, sda=sda_pin, freq=400000)
    init_mpu6050(i2c)

    data = get_mpu6050_data(i2c)

    pitch = get_pitch_alternate(data['accel'])
    roll = get_roll_alternate(data['accel'])

    return pitch, roll
    
 
pitch = 0
roll = 0
prev_time = utime.ticks_ms()
 
"""
while True:
    data = get_mpu6050_data(i2c)
    curr_time = utime.ticks_ms()
    dt = (curr_time - prev_time) / 1000
 
    tilt_x, tilt_y, tilt_z = calculate_tilt_angles(data['accel'])
    pitch, roll = complementary_filter(pitch, roll, data['gyro'], dt)
 
    prev_time = curr_time
    
 
    #print("Temperature: {:.2f} °C".format(data['temp']))
    #print("Tilt angles: X: {:.2f}, Y: {:.2f}, Z: {:.2f} degrees".format(tilt_x, tilt_y, tilt_z))
    #print("Pitch: {:.2f}, Roll: {:.2f} degrees".format(pitch, roll))
    print("------------------")
    print(get_pitch_alternate(data['accel']))
    print(get_roll_alternate(data['accel']))
    print("------------------")
    #print("Acceleration: X: {:.2f}, Y: {:.2f}, Z: {:.2f} g".format(data['accel']['x'], data['accel']['y'], data['accel']['z']))
    #print("Gyroscope: X: {:.2f}, Y: {:.2f}, Z: {:.2f} °/s".format(data['gyro']['x'], data['gyro']['y'], data['gyro']['z']))
    
	# Delay for 1 seconds
    utime.sleep(1)
"""