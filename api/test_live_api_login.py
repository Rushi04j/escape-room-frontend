import urllib.request
import json

url = "https://escape-room-backend.vercel.app/api/auth/login"
data = json.dumps({"email": "testverif123@test.com", "password": "password123"}).encode("utf-8")
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
try:
    response = urllib.request.urlopen(req)
    print("SUCCESS", response.status)
    print(response.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP ERROR", e.code)
    print(e.read().decode("utf-8"))
except Exception as e:
    print("OTHER ERROR", e)
