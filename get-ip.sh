BOT_TOKEN="6334153050:AAGAd8dCN4Pw3zROFFO-dY-HhzS2890ef1M"
CHAT_ID="2059864279"

IP_ADDRESS=$(curl -s api64.ipify.org)

curl -s \
  -X POST \
  https://api.telegram.org/bot$BOT_TOKEN/sendMessage \
  -d chat_id=$CHAT_ID \
  -d text="IP Address: $IP_ADDRESS"
