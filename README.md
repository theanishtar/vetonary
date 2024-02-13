# Check từ ngữ bậy bạ tiếng Việt

<img src='./images/cleanwords.png' width='80%'></img>

## Các APIs

- Clean words:
  - Dùng để làm sạch các từ ngữ trong một chuỗi, và chuyển chúng thành dạng `beep (*)`
  - Ví dụ: `con chó nhamloz` -> `con *** *******` | vì [***chó, nhamloz là 2 từ xấu***]()

```js
POST: http://localhost:8080/api/cleanwords
body: {
  {
    "words": "con chó loz thúi"
  }
}
res: {
  {
    "badWords": [
        {
            "_id": "652f83a480116248fd2069cb",
            "createDate": "2020-05-18T14:10:30.000Z",
            "formatDate": "18-05-2020",
            "label": 1,
            "name": "chó",
            "severityLevel": 10
        },
        {
            "_id": "652f83a480116248fd2066a8",
            "createDate": "2020-05-18T14:10:30.000Z",
            "formatDate": "18-05-2020",
            "label": 1,
            "name": "loz",
            "severityLevel": 2
        }
    ],
    "label": 2,
    "cleanWord": "con *** *** thúi",
    "message": "This is VN badword"
  }
}
```

## Bảo mật

Những APIs tương tác với database hoặc CRUD dữ liệu, cần phải truyền token để sử dụng


- Check badword:
  - Tốc độ kiểm tra tối ưu hơn

```js
POST: http://localhost:5152/api/badword
body: {
  {
      "words":"nhamloz z"
  }
}
res: {
  {
    "badWords": [
        {
            "_id": "652f83a480116248fd2069cb",
            "createDate": "2020-05-18T14:10:30.000Z",
            "formatDate": "18-05-2020",
            "label": 1,
            "name": "chó",
            "severityLevel": 10
        },
        {
            "_id": "652f83a480116248fd2066a8",
            "createDate": "2020-05-18T14:10:30.000Z",
            "formatDate": "18-05-2020",
            "label": 1,
            "name": "loz",
            "severityLevel": 2
        }
    ],
    "label": 1,
    "message": "This is VN badword"
  }
```