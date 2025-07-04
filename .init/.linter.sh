#!/bin/bash
cd /home/kavia/workspace/code-generation/tictacweb-66474-5d0cce1c/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

