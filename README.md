AncesTree Chat is a real time chat service for the progressive web app AncesTree available on : [https://ancestree.igpolytech.fr/](https://ancestree.igpolytech.fr/).

# Doc

## Node modules

*mongoose : [https://mongoosejs.com/](Mongoose web site)
*socket.io : [https://socket.io/](Socket IO web site)

## Routes 

### Users

GET /users

GET /users/:id

GET /users/rooms/:id

POST /users

PATCH /users/:id

DELETE /users/:id

### Rooms

GET /rooms

GET /rooms/:id

GET /rooms/messages/:id

POST /rooms

PATCH /romms/:id

DELETE /rooms/:id

### Messages

GET /messages

GET /messages/:id

POST /messages

PATCH /messages/:id

DELETE /messages/:id

## Models

### Users

```
{
    _id: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    pseudo: {
        type: String
    },
    rooms: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
    }
}
```
### Rooms

```
{
    name: {
        type: String
    },
    users: {
        type: [{ type: String, ref: 'User' }]
    },
    messages: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
    }
}   
```

### Messages
```
{
    message: {
        type: String
    },
    sender: {
        type: String,
        ref: 'User'
    }
}
```

## Env
Create a `.env` file at the root of the project and update with the credentials for your MongoDB instance.

```
MONGO_DB=mongodb://<ip>:<port>/<dbname>
```

Then run the server
```
npm install
node App.js
```

