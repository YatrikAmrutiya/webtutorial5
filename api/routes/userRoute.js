const usersData = require("../db/users");
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../db/users.js');

module.exports = (app) => {
  app.post("/hello", (req, res) => {
    res.send("Hello");
  });

  //route to get all the users in the file
  app.get("/users", (req, res) => {
    if(!usersData.length) {
        return res.status(404).json({ message: 'Users not found', success: false });
    }
    res.json({
      message: "Users retrieved",
      success: true,
      users: usersData,
    });
  });

  //route to put (update) email/firstname for given Id
  app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { email, firstName } = req.body;
  
    if (!email || !firstName) {
      return res.status(400).json({ message: 'Missing email or firstName in the request body', success: false });
    }
  
    // Find the user in the data
    const user = usersData.find(user => user.id === id);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
  
    // Update the user's email and firstName
    user.email = email;
    user.firstName = firstName;
  
    // res.json({ message: 'User updated', success: true });

 fs.writeFile(usersFilePath, `module.exports = ${JSON.stringify(usersData, null, 2)};`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
    res.json({ message: 'User updated', success: true });
  });
});

//following is the route to add a new user, it accepts user email and firstname
app.post('/add', (req, res) => {
    const { email, firstName } = req.body;
    if (!email || !firstName) {
        return res.status(400).json({ message: 'Missing email or firstName in the request body', success: false });
      }
    // Generate a unique ID for the new user
    const id = Math.random().toString(36).substr(2, 9);

    // Create a new user object
    const newUser = {
      id,
      email,
      firstName
    };

    // Add the new user to the data
    usersData.push(newUser);
    fs.writeFile(usersFilePath, `module.exports = ${JSON.stringify(usersData, null, 2)};`, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({ message: 'Internal server error', success: false });
        }
        res.json({ message: 'User added', success: true });
      });
    
  });

  //route to get a particular user
  app.get('/user/:id', (req, res) => {
    const { id } = req.params;

    const user = usersData.find(user => user.id === id);

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    res.json({ success: true, user });
  });
  
};
