cd Domo-pi

sudo chmod +x restart-lt.sh

gnome-terminal --command "sudo ./restart-lt.sh"

gnome-terminal --command "sudo node server.js"

sudo node server.js
