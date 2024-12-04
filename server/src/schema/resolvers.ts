import { User} from "../models/index.js";
import { signToken, AuthenticationError } from "../services/auth.js";

const resolvers = {
  Query: {
    //tested and worked
    users: async () => {
      return User.find().populate("savedBooks");
    },
    //tested and worked
    user: async (_parent: any, { username }: { username: string }) => {
      
      return User.findOne({ username }).populate("savedBooks");
    },
    //tested and worked
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("Could not authenticate user.");
    },
  },
  Mutation: {
    addUser: async (
      //tested and worked
      _parent: any,
      {
        input,
      }: { input: { username: string; email: string; password: string } }
    ) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    //tested zND worked
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ) => {
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
    saveBook: async (
      _parent: any,
      {
        input,
      }: { input: { bookId: string; title: string; authors: [string] } },
      context: any
    ) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { ...input } } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: any
    ) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

export default resolvers;
