#!/bin/zsh
# Publie BEFORE sur https://flous-dev.github.io/before/
# Usage : ./publier.sh "message du commit" [autres fichiers à inclure…]
# Tamponne une nouvelle version dans before.html et version.txt : au prochain
# lancement, l'app voit qu'elle est périmée et se recharge toute seule.
set -e
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
msg="$1"; shift || true
[ -n "$msg" ] || { echo "Il faut un message de commit"; exit 1; }
v=$(date +%Y%m%d%H%M%S)
sed -i '' -E "s/^const BUILD='[0-9]+';/const BUILD='$v';/" before.html
grep -q "^const BUILD='$v';" before.html || { echo "Tampon BUILD introuvable"; exit 1; }
echo "$v" > version.txt
git add before.html version.txt "$@"
git commit -q -m "$msg" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push -q origin main
for i in $(seq 1 24); do
  sleep 5
  live=$(curl -s "https://flous-dev.github.io/before/version.txt?t=$(date +%s)")
  if [ "$live" = "$v" ]; then echo "EN LIGNE après $((i*5)) s · version $v"; exit 0; fi
done
echo "Poussé, mais pas encore visible en ligne après 2 min"
