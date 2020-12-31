# Online-Shop (SneakerHeads)

This project is a representation of the abilities I acquired during a 7 months Full-Stack Web Development course.
Throughout this project i will demostrate my knowledge using **React.js**, **Node.Js** and **MongoDB**.

### MongoDB

_This project collections will be inside my-app/DB folder_

- Please read the README.md file next to it if you would like to change to local mongoDB

# Start Up

_Make sure none of the ports 3900 and 3000 in your localhost are being used._  
_dependencies: node.js need to be installed on the computer to run this application._

1. Open CMD in wanted directory and paste the following:
   ```
   git clone git@bitbucket.org:YuvalAzaria/my-app.git
   ```
   Optionaly you can download the zip file and install it instead.
2. Open my-app directory with you code editor.
3. Split CMD into two windows both at my-app directory, in the first one stay at my-app and type:
   ```
   npm i
   ```
   wait until it's finish installing then type
   ```
   npm start
   ```
   in the second window go to server directory by typing
   ```
   cd server
   ```
   and then type
   ```
   npm i
   ```
   wait until it's finish installing then type
   ```
   npm run start
   ```

# In Application

_The application containes 3 users an ADMIN user and EDITOR user and a NORMAL user._  
_You can sign in using either one of them or create your own NORMAL user using the signup page(make sure to use a valid email)._
_Brand pages are without content_

### NORMAL user abilities:

- can view products and add them to his cart.
- edit his account settings like user name email and password.
- pay for listed itemes in the cart.

### ADMIN user abilities:

- delete existing users completely (have an option to restore the user in the page after deleting).
- promote and demote users to EDITOR or NORMAL .
- create delete and update products.
- all the NORMAL user abilities.

### EDITOR user abilities:

- create delete and update products.
- all the NORMAL user abilities.

### **Signin as ADMIN user:**

```
Email: admin@admin.com
Password: admin@admin.com
```

### **Signin as EDITOR user**

```
Email: editor@editor.com
Password: editor@editor.com
```

### **Signin as NORMAL user**

```
Email: normal@normal.com
Password: normal@normal.com
```

# Description

### Users handling (crud)

1. Signup - any user can signup as a new NORMAL user to the application with the 3 steps signup system, after filling all the inputs and submiting the form, a confirmation email will be sent to the user's email adress to confirm it.
2. Signin - Only a confirmed user can login to the application, after loging in a JWT token with the user details will be added to the user's local storage and will be added to the headers of each request from the clinet to the server.
3. A user can logout of the system, edit his name, email and password or delete his user completely.

### Products handling (crud)

1.  Products rendering - both Home, HandleProducts , Browse and Product (single) pages render products from the database.

    _each one is a bit different:_

    - Home page render products with the most views, each product increment by 1 view each time the single product page load.
    - HandleProducts page render all the products in the prodcuts collection as default but can be filtered by a single brand each time.
    - Browse page render all the products in the products collection but limits to 8, user can press the _load more_ button to load 8 more products. in addition a user can filter the result by multiple or single brands and price range.
    - Product page render a single product with an image carousel, description, price and add to cart button.

# Support

For any questions regarding the application fill free to contact me via email

```
Yuval-Azaria-mail: yuval66550@gmail.com
```
