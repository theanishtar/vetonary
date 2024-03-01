# Danh sách các APIs

## Công cộng

### Làm sạch

#### Làm sạch các từ ngữ thông qua `word`
- Feature: Cleanword by word
- Description: vì GET nên chỉ dùng cho các câu ngắn
- Protocol: GET
- authorization: Không
- url: `/api/cleanwords?word=tâm dâm quá đi chó`
- res:
>```json
>{
>  "badWords": [...], // dữ liệu dài nên không để ở đây, vui lòng test api nếu cần
>  "label": 2,
>  "cleanWord": "******* quá đi ***",
>  "message": "This is VN badword"
>}
>```
<!-- <details>
<summary>res</summary>
</details> -->

#### Làm sạch các từ ngữ thông qua `word`
- Feature: Cleanwords by name  
- Description: check dữ liệu lớn hơn
- Protocol: POST
- authorization: Không
- url: `/api/cleanwords`
- body: 
>```json
>"words": "tâm dâm quá thằng chó"
>```

- res:
>```json
>{
>  "badWords": [...], // dữ liệu dài nên không để ở đây, vui lòng test api nếu cần
>  "label": 3,
>  "cleanWord": "******* quá ***** ***",
>  "message": "This is VN badword"
>}
>```
<!-- <details>
<summary>res</summary>
</details> -->

### Kiểm tra

#### Lấy tất cả Badwords trong Cache và Database
- Feature: Get All Badword
- Descrition: Lấy tất cả Badwords trong Cache và Database
- Protocol: GET
- url: `/api/badwords`
- authorization: Yêu cầu quyền Admin

#### Lấy một Badwords với `patch name`
- Feature: Get Badword by name
- Descrition: Lấy trong Cache trước, nếu không có thì lấy trong Database
- Protocol: GET
- url: `/api/badword?name=`
- authorization: Không

#### Kiểm tra một câu có chứa Badwords hay không
- Feature: Check Badword by words
- Descrition: Dùng POST nên có thể kiểm tra dữ liệu lớn
- Protocol: POST
- url: `/api/badwords`
- authorization: Không
- body: 
>```json
>"words": "thằng chó"
>```

- res:
>```json
>{
>  "badWords": [...], // dữ liệu dài nên không để ở đây, vui lòng test api nếu cần
>  "label": 1,
>  "message": "This is VN badword"
>}
>```

## Bảo mật

### Đăng nhập

#### Đăng nhập bằng username và password
- Feature: Signin 
- DescriptionL: lấy Token
- Protocol: POST
- authorization: Không
- url: `/api/auth/signin`
- body: 
>```json
>{
>  "username": "your_username", // NOT NULL
>  "password": "your_password", // NOT NULL 
>}
>```

### Đăng xuất
#### Đăng xuất
- Feature: Singout
- Descrioption: xóa token
- Protocol: POST
- url: `/api/auth/signout`
- authorization: Không

## Database
#### Lấy tất cả dữ liệu collections Badwords
- Feature: Get ALl Badwords 
- Description: Lấy tất cả dữ liệu collections Badwords
- Protocol: GET
- url: `/api/dbs`
- authorization: Yêu cầu quyền Admin


#### Lấy một Badwords với `patch name`
- Feature: Get Badword from Database by name 
- Descrition: Lấy một Badwords với `patch name`
- Protocol: GET
- url: `/api/db?name=`
- authorization: Yêu cầu quyền Moderator

#### Thêm một Badwords mới vào database
- Feature: Post Badword to Database 
-Description: Thêm một Badwords mới vào database
- Protocol: POST
- authorization: Yêu cầu quyền Moderator
- url: `/api/db`
- body: 
>```json
>{
>  "name": "example", // NOT NULL
>  "label": , // NULL (fefault is 1)
>  "severityLevel": , // NULL (fefault is 1)
>}
>```

#### Cập nhật một Badwords Thông qua `patch name`
- Feature: Update Badword from Database by name 
- Descripton: Cập nhật một Badwords Thông qua `patch name`
- Protocol: PUT
- url: `/api/db?name=`
- authorization: Yêu cầu quyền Moderator

#### Xóa một Badwords Thông qua `patch name`
- Feature: Delete Badword from Database by name 
- Description: Xóa một Badwords Thông qua `patch name`
- Protocol: DELETE
- url: `/api/db?name=` 
- authorization: Yêu cầu quyền Moderator

## Caches

#### Lấy tất cả dữ liệu caches Badwords
- Feature: Get ALl Badwords in Cache 
- Description: Lấy tất cả dữ liệu caches Badwords
- Protocol: GET
- url: `/api/caches`
- authorization: Yêu cầu quyền Moderator

#### Lấy một Badwords với `patch key`
- Feature: Get Badword from Cache by key 
- Description: Lấy một Badwords với `patch key`
- Protocol: GET
- url: `/api/cache?key=`
- authorization: Không

#### Thêm Badwords từ MongoDB vào Cache
- Feature: Post All Badword from Database to Cache 
- Description: Thêm Badwords từ MongoDB vào Cache
- Protocol: POST
- authorization: Yêu cầu quyền Moderator
- url: `/api/caches`

#### Thêm một Badwords vào Cache
- Feature: Post Badwords to Cache 
- Description: dữ liệu nên được lấy từ MongoDB
- Protocol: POST
- url: `/api/cache`
- authorization: Yêu cầu quyền Moderator
- body:
>```json
>"name": "QWERTY",
>"label": 1,
>"severityLevel": 1,
>"createDate": 2020-05-18T14:10:30Z
>```

#### Cập nhật một Badwords Thông qua `patch key`
- Feature: Update Badword from Cache by key
- Description: Cập nhật một Badwords Thông qua `patch key`
- Protocol: PUT
- url: `/api/cache?key=`
- authorization: Yêu cầu quyền Moderator
- body:
>```json
>"name": "QWERTY",  // NULL (default is key from query path)
>"label": 1,
>"severityLevel": 1,
>"createDate": 2020-05-18T14:10:30Z
>```

#### Xóa một Badwords Thông qua `patch name`
- Feature: Delete Badword from Cache by name 
- Description: Xóa một Badwords Thông qua `patch name`
- Protocol: DELETE
- url: `/api/cache?name=` 
- authorization: Yêu cầu quyền Moderator

#### Lấy toàn bộ Badwords có trong Database mà không có trong Cache
- Feature: Get Badword from Cache 
- Desciption: Lấy toàn bộ Badwords có trong Database mà không có trong Cache
- Protocol: GET
- url: `/api/cache/missingRedis`
- authorization: Yêu cầu quyền Moderator

#### Lấy toàn bộ Badwords có trong Cache mà không có trong Database
- Feature: Get Badword from Cache 
- Description: Lấy toàn bộ Badwords có trong Cache mà không có trong Database
- Protocol: GET
- url: `/api/cache/missingMongo`
- authorization: Yêu cầu quyền Moderator

#### Lấy 100 Badwords có level cao nhất (phổ biến nhất)
- Feature: Get Top 100 Badword from Cache (Lấy toàn bộ Badwords có trong Cache mà không có trong Database)
- Description: Lấy 100 Badwords có level cao nhất (phổ biến nhất). Đọc trong Cache trước, nếu không có sẽ đọc từ Database
- Protocol: GET
- url: `/api/cache/top`
- authorization: Yêu cầu quyền Moderator
