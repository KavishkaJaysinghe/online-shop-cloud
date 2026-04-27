#!/usr/bin/env bash
set -e
BASE=${BASE:-http://localhost:3003}
USER=${USER:-student}
PASS=${PASS:-Password123}

curl -s -X POST $BASE/auth/register -H 'Content-Type: application/json' -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" || true
TOKEN=$(curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" | node -pe "JSON.parse(fs.readFileSync(0)).token")
echo "TOKEN=$TOKEN"
PRODUCT=$(curl -s -X POST $BASE/products -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"name":"Cloud Laptop","price":250000,"description":"Demo product","stock":20}')
echo $PRODUCT
ID=$(echo $PRODUCT | node -pe "JSON.parse(fs.readFileSync(0))._id")
curl -s $BASE/products -H "Authorization: Bearer $TOKEN" | jq .
curl -s -X POST $BASE/products/buy -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{\"ids\":[\"$ID\"]}" | jq .
curl -s $BASE/orders -H "Authorization: Bearer $TOKEN" | jq .
