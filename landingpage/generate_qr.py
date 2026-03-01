import qrcode

# URL of the escape room landing page
landing_page_url = "https://landingpage-hazel-mu.vercel.app/"

# Generate QR code
qr = qrcode.make(landing_page_url)

# Save the QR code image
qr.save("escape_room_qr.png")

print("QR code generated successfully! Check escape_room_qr.png in your project folder.")
