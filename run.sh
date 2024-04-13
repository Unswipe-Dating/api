docker build -t nest-prisma-server .
docker run -d -t -p  3000:3000 --env-file .env nest-prisma-server