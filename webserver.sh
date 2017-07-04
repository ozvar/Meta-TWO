#!/bin/sh
python -m SimpleHTTPServer &
open -a /Applications/*Chrome.app http://127.0.0.1:8000