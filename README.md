# mongo-api
MongoDB API Demo


Setup + Start Server
====================

```bash
npm install
npm start
```

List Users
==========

```bash
curl \
    --request GET \
        http://localhost:8080/api/users
```

Get User
========

```bash
curl \
    --request GET \
        http://localhost:8080/api/users/123
```

Login
=====

```bash
curl \
    --request POST \
    --header "Content-Type: application/json" \
    --data '{"email": "eddie@example.com", "password": "abc123"}' \
        http://localhost:8080/api/auth/login
```
