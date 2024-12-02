import { User } from "../models/index.js";
import { signToken, AuthenticationError } from "../services/auth.js";
const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate("books");
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username }).populate("books");
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate("books");
            }
            throw new AuthenticationError("Could not authenticate user.");
        },
    },
    Mutation: {
        addUser: async (_parent, { input, }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Could not authenticate user.");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Could not authenticate user.");
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent, { input, }, context) => {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: { ...input } } }, { new: true, runValidators: true });
            }
            throw new AuthenticationError("You need to be logged in!");
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });
            }
            throw new AuthenticationError("You need to be logged in!");
        },
    },
};
export default resolvers;
