RUN steps:

1. npm init -y (init workspace for server)
2. npm i express (install express package)
3. npm i nodemon (nodemon helps update app when saving)
4. npm i cors dotenv bcrypt cookie-parser jsonwebtoken
5. npm i mongoose (package to connect database)

**NOTE:**

- To run this app use this command **npm run start** in current directory
- How to connect to mongoose (if use web cluster, remember to add your ip or apply for all ip).

```
const dotenv = require("dotenv"); // Import dotenv
const mongoose = require("mongoose"); // Import mongoose
dotenv.config(); // Use dotenv

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL); // MONGO_URL is a var in file .env
  console.log("Connected to MongoDB");
};
connectToMongo();
```

![image](https://github.com/user-attachments/assets/a18ed740-e0d5-4300-b406-c15f0f6c4112)



key meta lama: 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
key gpt4o: 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


## JSON google calendar:
```
{
  "kind": "calendar#event",
  "etag": "\"p33q5f5b2gsk60g0\"",
  "id": "1g6t3g8p1v0e8b9ro9d1ha0t4g",
  "status": "confirmed",
  "htmlLink": "https://www.google.com/calendar/event?eid=1g6t3g8p1v0e8b9ro9d1ha0t4g",
  "created": "2023-04-01T10:00:00Z",
  "updated": "2023-04-01T10:00:00Z",
  "summary": "Cuộc họp định kỳ",
  "description": "Cuộc họp định kỳ vào thứ Ba và thứ Sáu.",
  "location": "Địa điểm cụ thể",
  "creator": {
    "email": "your-email@example.com",
    "displayName": "Tên bạn",
    "self": true
  },
  "organizer": {
    "email": "your-email@example.com",
    "displayName": "Tên bạn",
    "self": true
  },
  "start": {
    "date": "2015-06-01",
    "dateTime": "2015-09-15T06:00:00+02:00",
    "timeZone": "Europe/Zurich"
  },
  "end": {
    "date": "2015-06-02",
    "dateTime": "2015-09-15T07:00:00+02:00",
    "timeZone": "Europe/Zurich"
  },
  "iCalUID": "1g6t3g8p1v0e8b9ro9d1ha0t4g@google.com",
  "sequence": 0,
  "attendees": [
    {
      "email": "attendee1@example.com",
      "displayName": "Người tham dự 1",
      "responseStatus": "accepted"
    },
    {
      "email": "attendee2@example.com",
      "displayName": "Người tham dự 2",
      "responseStatus": "needsAction"
    }
  ],
  "recurrence": [
    "RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=TU,FR"
  ],
  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email",
        "minutes": 1440
      },
      {
        "method": "popup",
        "minutes": 10
      }
    ]
  },
  "eventType": "default"
}
```