npm run clean
npm run build:client:webpack
npm run build:client:seablob
npm run build:client:nodeexec
npm run build:client:rmsign
npx postject ./.client-webpack/lambdadyn NODE_SEA_BLOB ./.client-webpack/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
npm run build:client:sign
