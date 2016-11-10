# Mini City Redesigned

As my final project at DigitalCrafts, I redesigned the MVP I built for Mini City at Goodie Nation Hackathon. I wanted to restructure it to have an independent API and have Admin Portal to interact with the database using the API, in attempt to increase scalability and to have an option of making some data open to public.
In Admin Portal, you can access current data including users, NFC devices, events, and containers. You can register a new user, add a new event, or edit/delete an existing user or event. <i>Redesgined with API using Python/Flask, MySQL and Angular.js with UI Router</i>

##Technologies & Frameworks 
- HTML
- CSS/SASS
  - Compass
- Bootstrap, UI Bootstrap
- JavaScript
- AngularJS
  - UI Router
- Python
  - Flask
- MySQL


##What I learned
- **CRUD Principle** How the basic four operations, Create, Read, Update and Delete correspond to the HTTP methods, such as GET and POST. 
- **Endpoint Design: Nouns and Verbs** Instead of using verbs in endpoints, I learned that it is desriable to use nouns to represent resources and have the HTTP method as what to do (verbs), for more flexibility and better organization. It seems that the way endpoints are desgined are closely interwined with the way data is structured. It was interesting to me as it means you want to work with the entire data as a system and an API as a set of patterns to navigate the system. Although my API was simple, I very much enjoyed reading about APIs and building one on my own. I would like to keep learning about API design. 
- **UI Router** Instead of using ngRoute module of Angular.js, I used UI Router to create a more dynamic single page application that has nested views. As I was learning how to work with $stateProvider of UI Router, I could see the differences between UI Router and Angular router, and when UI Router will be more appropriate to use. 
- **Image Upload** There are many ways to save an image, but I wanted to try encoding the image and save it as a blob directly into the database, using HTML5's File Reader object. I could quickly see why it was not a common practice to save it in a database because the size of the blob for a rather small image (less than 2MB) was too large to be easily handled in a browser. 

##Problems Solved
- **Using Relational Database** I decided to use MySQL because the data to be used were mainly about users and their NFC devices. All other data were additional information about users and devices, meaning they are relational in nature. I created 14 tables, one of which was for users, with 5 other 'children' tables such as employment record, place of birth, parents' full name, whose table name starts with a underscore ('_') to indicate its relationship to the 'parent' users table.

##Future Implementation
- Authentication Layer 
  - Use an API key for authentication. 
