tmux new-session -d -s mysession

tmux split-window -v -t mysession

tmux select-pane -t 0

tmux send-keys -t mysession:0.0 'sudo node server.js' C-m

tmux select-pane -t 1

tmux send-keys -t mysession:0.1 'sudo ./restart-lt.sh' C-m

tmux attach -t mysession
