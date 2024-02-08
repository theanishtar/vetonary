# Check từ ngữ bậy bạ tiếng Việt


- Check badword:

```js
POST: http://localhost:5152/api/badword
body: {
  {
      "words":"nhamloz z"
  }
}
res: {
  "data": {
    "name": "nhamloz",
    "label": 1,
    "severityLevel": 1,
    "createDate": "2020-05-18T14:10:30Z"
  },
    "message": "This is VN badword"
  }
```