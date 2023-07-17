for i in {1..100000}; do
curl -s -XGET -o /dev/null -w "%{http_code}" http://localhost:10000/builder
sleep 0.1

done
