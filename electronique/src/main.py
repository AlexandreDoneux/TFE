# A mettre dans un fichier python à part (secrets.py / secrets.json)
# SSID de point d'accès wifi
SSID = "SSID"
# Mot de passe wifi
PASSWORD = "PASSWORD"

import network
import time
import urequests

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID,PASSWORD)

print(wlan.isconnected())
print(wlan.ifconfig())
   
