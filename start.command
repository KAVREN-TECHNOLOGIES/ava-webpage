#!/bin/zsh
set -e
cd "$(dirname "$0")"

AVA_NODE="$(command -v node || true)"
if [[ -z "$AVA_NODE" ]] || ! "$AVA_NODE" -e 'if (Number(process.versions.node.split(".")[0]) < 22) process.exit(1)' >/dev/null 2>&1; then
  AVA_NODE="/Users/sash/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$AVA_NODE" ]]; then
  print 'Instala Node.js 22.12 o posterior para abrir AVA.'
  read -k 1
  exit 1
fi
if [[ ! -f node_modules/vite/bin/vite.js ]]; then
  print 'Primero ejecuta npm install en esta carpeta.'
  read -k 1
  exit 1
fi
exec "$AVA_NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort
