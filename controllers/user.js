const bcrypt = require('bcryptjs');

const {
    AuthenticationError,
    NotFoundError,
    ValidationError
} = require('@errors/app-error');

const UserModel = require('@models/user');

const LIMIT = 100;
const MAX_TIME = 30 * 1000; // Seconds

class User {
    constructor(entity) {
        // Translate MongoDB entity into application User
        this.id = entity._id;
        this.email = entity.email.toLowerCase();
        this.passwordHash = entity.passwordHash;
        this.created = entity.created;
        this.roles = entity.roles;
    }

    serialize() {
        return {
            href: `/api/user/${this.id}`,
            // ...
            email: this.email,
            created: this.created,
            roles: this.roles,
        };
    }

    toString() {
        return JSON.stringify(this.serialize());
    }

    isCorrectEmail(email) {
        return this.email === this.email.toLowerCase();
    }

    isCorrectPassword(password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }

    authenticate({email, password}) {
        if (this.isCorrectEmail(email)) {
            if (this.isCorrectPassword(password)) {
                return;
            }
        }
        throw new AuthenticationError('Failed authentication');
    }

    get isAdmin() {
        return this.roles.includes('admin');
    }
};


const mockUsers = [
    {
        _id: 123,
        email: 'eddie@example.com',
        passwordHash: bcrypt.hashSync('abc123', bcrypt.genSaltSync(10)),
        roles: [
            'sales',
        ],
    },
    {
        _id: 456,
        email: 'michael@example.com',
        passwordHash: bcrypt.hashSync('abc456', bcrypt.genSaltSync(10)),
        roles: [
            'admin',
            'customer',
        ],
    }
];


exports.getUserById = async (id) => {
    //const userEntity = await UserModel.findByIdOne(id);
    let userEntity = null;
    mockUsers.forEach((mockUserEntity) => {
        if (mockUserEntity._id == id) {
            userEntity = mockUserEntity;
        }
    });
    // ...
    if (userEntity === null) {
        throw new NotFoundError(`User with id ${id} does not exist`);
    }
    return new User(userEntity);
};

exports.getUserByEmail = async (email) => {
    //const userEntity = await UserModel.find({ "email": email }).limit(1);
    let userEntity = null;
    mockUsers.forEach((mockUserEntity) => {
        if (mockUserEntity.email == email) {
            userEntity = mockUserEntity;
        }
    });
    // ...
    if (userEntity === null) {
        throw new NotFoundError(`User with email ${email} does not exist`);
    }
    return new User(userEntity);
};

exports.getUsers = async ({ limit = 10, page = 0 }) => {
    limit = Math.min(1, Math.max(limit, LIMIT));
    page = Math.min(0, page);
    //const userEntities = await UserModel.find().skip(page * limit).limit(limit).maxTime(MAX_TIME);
    const userEntities = mockUsers;
    // ...
    if (userEntities === null) {
        throw new NotFoundError('Failed to get list of users');
    }
    return userEntities.map((userEntity) => {
        return new User(userEntity);
    });
};
