const express = require("express");
// assuming this router is only for /users currently
const router = express.Router();
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/user");

// routes
// list all the users
// using get request for fetching all the users
// using post request for creation of new users
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

// router.get("/", async (req, res) => {
//     // fetching all the users from the database
//     const allDbUsers = await User.find({});
//     const html = `
//       <ul>
//       ${allDbUsers
//         .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
//         .join("")}
//       </ul>
//       `;
//     return res.send(html);
//   });

// combining different routes and creating one
router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

//// we can combine more than one requests into mutliple routes using the same function.
// // edit an existing user
// app.patch("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

// // delete an existing user
// app.delete("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

module.exports = router;
