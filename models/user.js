const mongoose = require('mongoose');


const ROLES = [
  "enterprise",
  "admin",
  "sales",
  "customer",
];


const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  deleted: { type: Date, default: null },
  roles: [
    {
      type: String,
      enum: {
        values: ROLES,
        metaName: "roles",
      }
    }
  ],
});

UserSchema.index({ email: 1 });

const UserModel = mongoose.model('User', UserSchema, 'users');

module.exports = UserModel;
