tmux new-session -d -s mysession

# Fenêtre 1
tmux split-window -h -t mysession
tmux select-pane -t 0
tmux send-keys -t mysession:0.0 'sudo node server.js' C-m

# Fenêtre 2
tmux split-window -h -t mysession
tmux select-pane -t 1
tmux send-keys -t mysession:0.1 'sudo ./restart-lt.sh' C-m

# Fenêtre 3
tmux split-window -h -t mysession
tmux select-pane -t 2
tmux send-keys -t mysession:0.2 'chmod +x get-ip.sh' C-m
tmux send-keys -t mysession:0.2 'sudo ./get-ip.sh' C-m

tmux attach -t mysession
