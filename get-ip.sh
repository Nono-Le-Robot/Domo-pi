BOT_TOKEN="6334153050:AAGAd8dCN4Pw3zROFFO-dY-HhzS2890ef1M"
CHAT_ID="2059864279"

# Fonction pour envoyer le message à Telegram
send_message() {
  local message="$1"

  curl -s \
    -X POST \
    https://api.telegram.org/bot$BOT_TOKEN/sendMessage \
    -d chat_id=$CHAT_ID \
    -d text="$message"
}

# Tentatives de récupération de l'adresse IP (avec un maximum de 3 tentatives)
for i in {1..3}; do
  IP_ADDRESS=$(curl -s api64.ipify.org)
  
  # Vérifier si l'adresse IP a été obtenue avec succès
  if [ -n "$IP_ADDRESS" ]; then
    break  # Sortir de la boucle si l'adresse IP a été obtenue avec succès
  else
    # Attendre 5 secondes avant de réessayer
    sleep 5
  fi
done

# Vérifier si l'adresse IP a été obtenue avec succès
if [ -n "$IP_ADDRESS" ]; then
  # Supprimer tous les messages précédents dans le chat
  curl -s \
    -X POST \
    https://api.telegram.org/bot$BOT_TOKEN/deleteMessage \
    -d chat_id=$CHAT_ID

  # Envoyer le nouveau message avec l'adresse IP
  send_message "$IP_ADDRESS"
else
  send_message "Erreur lors de la récupération de l'adresse IP."
fi

