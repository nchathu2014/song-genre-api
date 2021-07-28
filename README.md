# Song Genre API

API

GET | api/genres
GET | api/genres/:id

POST | api/genres

request body
```
{
    "name": String | Minimum Length 3 | Required,
    "desc": String | Minimum Length 10 
}
```

PUT | api/genres/:id
request body
```
{
    "name": String | Minimum Length 3 | Required,
    "desc": String | Minimum Length 10 
}
```

DELETE | api/genres/:id