if ! npm i > log.txt; then 
    echo "Failed to install dependencies";
    exit 1;
fi
echo "Dependencies installed successfully";

if ! npx prisma generate >> log.txt; then 
    echo "Failed to generate Prisma Client";
    exit 1;
fi
echo "Prisma Client generated successfully";

if [ -f .env ]; then
    echo ".env file already exists. Deleting it..."
    rm .env
fi

echo "SALT_ROUNDS=\"edit me\"" >> .env
echo "JWT_SECRET=\"edit me\"" >> .env
echo "JWT_REFRESH_SECRET=\"edit me\"" >> .env
echo "ADMIN_KEY=\"123\"" >> .env
echo ".env file created successfully";

cd DockerExec

docker build -t pythonrunner ./python
docker build -t javarunner ./java
docker build -t crunner ./c
docker build -t cpprunner ./cpp
docker build -t gorunner ./go
docker build -t phprunner ./php
docker build -t rubyrunner ./ruby
docker build -t javascriptrunner ./javascript
docker build -t rrunner ./r
docker build -t swiftrunner ./swift
docker build -t rustrunner ./rust
docker build -t dartrunner ./dart

cd ..

if ! node lib/Startup/addAdmin.mjs; then 
    echo "Failed to add admin";
    exit 1;
fi

echo "Admin added successfully";