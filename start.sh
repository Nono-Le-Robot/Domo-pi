tmux new-session -d -s mysession

# Fenêtre 1
tmux split-window -v -t mysession
tmux select-pane -t 0
tmux send-keys -t mysession:0.0 'sudo node server.js' C-m

# Fenêtre 2
tmux split-window -h -t mysession
tmux select-pane -t 1
tmux send-keys -t mysession:0.1 'sudo ./restart-lt.sh' C-m

# Fenêtre 3
tmux new-window -t mysession
tmux select-pane -t 0
tmux send-keys -t mysession:1.0 'sudo ./get_ip.sh' C-m

tmux attach -t mysession
