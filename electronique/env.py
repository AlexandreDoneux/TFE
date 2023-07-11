# SSID de point d'accès wifi
SSID = "SSID"
# Mot de passe wifi
PASSWORD = "PASSWORD"

# number of minutes between each measure and sending of the data to distant database
data_interval = 0.05


# DEV, API ip address
api_ip_address = "IP_ADDRESS_OR_DOMAIN_NAME"


# probe_id and password
probe_id = 1
probe_password = "PROBE_PASSWORD"

# -------------- tilt density parameters

# used for testing tilt and density to interpolate a function (2nd degree) to estimate density : True -> testing mode active
calibration_mode = False

# estimation function parameters : a.x^2+b.x+c
func_param_a = 1
func_param_b = 1
func_param_c = 1
