# Expert2023

# Cara Menggunakan Jest utk Test JS
-- npm install --save-dev jest
-- npm test


npm init --y
npm install jest @types/jest --save-dev
npm install eslint --save-dev
"scripts": {
    "test": "jest --watchAll --coverage"
 },
npm run test

https://eslint.org/docs/latest/use/getting-started

ctrl+shift p > fix all

npm install @hapi/hapi

git clone --branch <branch> <url>


![alur_restapi](https://github.com/masbroustudio/Expert2023/assets/127388410/0b5ed611-ced7-4472-891f-4c820712e7d5)

```
auth-api/                   → Root Proyek.
├─ config/                  → Folder konfigurasi, digunakan untuk mengonfigurasi node-pg-migrate pada database testing.
├─ migrations/              → Berkas migrations database.
├─ src/                     → Source code aplikasi
│  ├─ Applications/         → Application Business Rules
│  │  ├─ security/          → Abstraksi/interface dari tools dan helper dalam hal security yang digunakan pada use case. Contohnya AuthTokenManager dan EncryptionHelper
│  │  ├─ use_cases/         → Alur bisnis aplikasi.
│  ├─ Commons/              → Shared folder.
│  │  ├─ exceptions/        → Custom exceptions.
│  ├─ Domains/              → Enterprise Business Rules.
│  │  ├─ authentications/   → Subdomain authentications, di sini berisi domain model (entities) dan abstraksi/interface AuthenticationRepository .
│  │  ├─ users/             → Subdomain users, di sini berisi domain model (entities) dan abstraksi/interface UserRepository.
│  ├─ Infrastructures/      → Agen External seperti Framework dan Tools External.
│  │  ├─ database/          → Driver database.
│  │  ├─ http/              → HTTP Server menggunakan Hapi.js.
│  │  ├─ repositories/      → Objek konkrit/implementasi dari repository domain.
│  │  ├─ security/          → Objek konkrit/implementasi dari tools dan helper dalam hal security.
│  │  ├─ container.js       → Penampung (container) seluruh instance dari service yang digunakan aplikasi.
│  ├─ Interfaces/           → Interface Adapter. Di sini kita akan mendefinisikan routes configuration dan juga handler yang dibungkus dengan Hapi Plugin.
│  ├─ app.js                → Entry point aplikasi.
├─ tests/                   → Utilitas kebutuhan untuk testing.
├─ .env                     → Environment variable.
├─ package.json             → Project Manifest.



npm init -y
npm install @hapi/hapi @hapi/jwt bcrypt dotenv nanoid@3.x.x pg
npm install @types/jest eslint jest node-pg-migrate nodemon --save-dev
npx eslint --init

"scripts": {
    "start": "node src/app.js",
    "start:dev": "nodemon src/app.js",
    "test": "jest --setupFiles dotenv/config",
    "test:watch": "jest --watchAll --coverage --setupFiles dotenv/config",
    "migrate": "node-pg-migrate",
    "migrate:test": "node-pg-migrate -f config/database/test.json"
  },

\Applications
\Commons
\Domains
\Infrastructures
\Interfaces
\app.js

psql --username postgres
Ac.22
CREATE DATABASE authapi; CREATE DATABASE authapi_test;
GRANT ALL PRIVILEGES ON DATABASE authapi, authapi_test TO developer;
ALTER DATABASE authapi OWNER TO developer; ALTER DATABASE authapi_test OWNER TO developer;

.env
# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=authapi
PGPASSWORD=supersecretpassword
PGPORT=5432
 
# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=developer
PGDATABASE_TEST=authapi_test
PGPASSWORD_TEST=supersecretpassword
PGPORT_TEST=5432


config/database/test.json

npm run migrate create "create table users"
npm run migrate create "create table authentications"
npm run migrate up

npm run migrate:test up

Infrastructures/database/postgres/pool.js

tests/
-- UsersTableTestHelper.js
-- AuthenticationsTableTestHelper.js
Anda tidak perlu khawatir bila kode tidak dituliskan dengan TDD, karena memang kode tersebut tidak perlu diuji.

#  PEMBUATAN CUSTOM ERROR
Commons/exceptions
-- ClientError.js
-- InvariantError.js
-- AuthenticationError.js
-- NotFoundError.js
...
Commons/exceptions/_test
-- ClientError.test.js
-- InvariantError.test.js
-- AuthenticationError.test.js
-- NotFoundError.test.js
...

npm run test:watch

Next.. Domain, Applications, Infrastructure, Interfaces, 

npm install instances-container

.env add :
# HTTP SERVER
HOST=localhost
PORT=5000

app.js
npm run start:dev


