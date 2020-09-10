# haruda-api

## Getting started

```sh
# Clone the project
git clone https://github.com/ludative/haruda-api.git
cd haruda-api

# Install dependencies
npm install

# or if you're using Yarn
yarn
```

```sh
yarn start # npm run start
```

## Description
- 공유 다이어리 API
- React web - https://github.com/ludative/haruda
- sequelize(mySql)를 이용한 api 구축
- .env 파일로 db 계정, 이메일 관리 (protect)

## folder
### lib
공통으로 사용하는 util, middleware 관리
### models
db table 관리
### routes
API 관리 (버전으로 관리하기 위해 v1.0로 폴더 분리)

## License
MIT License. See the [LICENSE](LICENSE) file.
