# User API Spec

## Register User API
Endpoint: POST /api/users

Request Body:
```json 
{
    "email": "babibubab@gmail.com",
    "username": "Hafiz123",
    "password": "adalah",
    "name": "hafiz pratama",
    "role": "admin",
    "isActive": true
}
```
Response Body Succes:
```json
{
    "data":{
        "email": "babibubab@gmail.com",
        "username": "Hafiz123",
        "password": "adalah",
    }
}
```
Response Body Errors :
```Json
{
    "errors" : "message1,message2"
}
```
