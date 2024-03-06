npm run clean
npm run build:client:webpack
npm run build:client:seablob
npm run build:client:nodeexec

npx postject .client-webpack/lambdadyn NODE_SEA_BLOB .client-webpack/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

DIR=$(pwd)

mkdir -p .pkg/bin

cd .pkg
cp ../.client-webpack/lambdadyn ./bin/
cp ../src/client/linux/* ./

zip -r lambdadyn-client.zip ./*

cd $DIR
echo "Finished building...good luck out there."