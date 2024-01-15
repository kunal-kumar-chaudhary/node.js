const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  // custom headers
  // it's a good practice to always add "X" in custom headers
  // it's done for the fact that it's easy to diustinguish between custom and default headers
  // there are built in headers as well as we can also make custom headers as we have made below
  res.setHeader("X-MyName", "kunal");
  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  // edit user with id
  await User.findByIdAndUpdate(req.params.id, { lastName: "changed" });
  return res.json({ status: "success " });
}

async function handleDeleteUserById(req, res) {
  // delete user with id
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "success" });
}

async function handleCreateNewUser(req, res){
 // automatically makes us available the data obtained from front into the body
  // this data we are currently getting by using postman not the real frontend
  // in case of frontend, we might be having form data
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are required..." });
  }
  //   users.push({ ...body, id: users.length + 1 });
  //   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //     return res.status(201).json({ status: "success", id: users.length });
  //   });

  // creating a new user (will return the user object)
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log(result);
  return res.status(201).json({ msg: "success", id : result._id });
}


module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
