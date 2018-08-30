# Mini City 2

For my final project at DigitalCrafts, I redesigned the MVP I built for Mini City at Goodie Nation Hackathon in 2016. The original MVP, built in Python, used server side UI rendering. I wanted to separate the back-end and the front-end, to have a REST API and an Angular applilcation for Admin Portal, in attempt to increase scalability and to have an option of making some data open to public. Currently, Admin Portal allows you to access and edit data such as registered users, NFC devices, events, and containers (locations). 

## Technologies & Frameworks 
- HTML
- CSS/SASS, Compass
- Bootstrap, UI Bootstrap
- JavaScript, AngularJS
- Python, Flask
- MySQL

## Notes
- **CRUD Principle and Endpoint Design** Each endpoints represent a resource, and HTTP methods allowed with the given endpoint represent differnt types of operation avaialble to the resource: Create (POST), Read (GET), Update (PUT) and Delete (DELETE). Thus, it makes sense to use a noun for an endpoint, instead of a verb, and have the HTTP method, which is in the form of a verb, represent an action to be taken. 
- **UI Router** Instead of using ngRoute module of AngularJS, I used UI Router to create a more dynamic single page application that utilizes nested views. 
- **Image Upload** Using HTML5's File Reader object, the application takes an uploaded image, encodes, and saves it as a blob in database. While it seemd like the most straightfoward way of saving uploaded images, I could quickly understand why it was not a common way of handling images; the size of the blob for a rather small image was too large to be easily handled in a browser. 
- **Using Relational Database** After initial discussion with Mini City, the user for the application and the client of the project, I decided to use MySQL because the data they deal with would be mostly relational in nature. It is mainly users and their NFC devices, and various supporting information about them. 

## Ideas for Future Implementation
- **Authentication Layer**: Use an API key for authentication. 
