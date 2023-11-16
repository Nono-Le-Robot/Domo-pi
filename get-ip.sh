BOT_TOKEN="6334153050:AAGAd8dCN4Pw3zROFFO-dY-HhzS2890ef1M"
CHAT_ID="2059864279"
MESSAGE_ID="17"

# Fonction pour envoyer ou éditer le message à Telegram
send_or_edit_message() {
  local message="$1"

  # Si MESSAGE_ID est vide, cela signifie que le message n'a pas encore été envoyé
  if [ -z "$MESSAGE_ID" ]; then
    # Envoyer le nouveau message avec l'adresse IP
    MESSAGE_ID=$(curl -s \
      -X POST \
      https://api.telegram.org/bot$BOT_TOKEN/sendMessage \
      -d chat_id=$CHAT_ID \
      -d text="$message" \
      | jq -r .result.message_id)
  else
    # Éditer le message existant avec la nouvelle adresse IP
    curl -s \
      -X POST \
      https://api.telegram.org/bot$BOT_TOKEN/editMessageText \
      -d chat_id=$CHAT_ID \
      -d message_id=$MESSAGE_ID \
      -d text="$message"
  fi
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
  # Envoyer ou éditer le message avec l'adresse IP
  send_or_edit_message "IP Address: $IP_ADDRESS"
else
  send_or_edit_message "Erreur lors de la récupération de l'adresse IP."
fi
