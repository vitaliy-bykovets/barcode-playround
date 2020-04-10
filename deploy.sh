rsync -avz frontend/ $PROD_SERVER:/var/www/barcode/frontend/
rsync -avz backend/ $PROD_SERVER:/var/www/barcode/backend/

ssh $PROD_SERVER 'cd /var/www/barcode/backend && docker-compose up -d'