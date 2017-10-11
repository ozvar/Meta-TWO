#!/bin/sh
python -m SimpleServer &
open -a /Applications/*Chrome.app http://127.0.0.1:8000