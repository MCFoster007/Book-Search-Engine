import { Book, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('books');
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username }).populate('books');
        },
        books: async () => {
            return await Book.find().sort({ createdAt: -1 });
        },
        Book: async (_parent, { BookId }) => {
            return await Book.findOne({ _id: BookId });
        },
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent, _args, context) => {
            // If the user is authenticated, find and return the user's information along with their books
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('books');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        addBook: async (_parent, { input }, context) => {
            if (context.user) {
                const book = await Book.create({ ...input });
                await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { books: book._id } });
                return book;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
        saveBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: { bookId, bookText } } }, // Adjust based on schema
                { new: true, runValidators: true });
            }
            throw AuthenticationError;
        },
        removeBook: async (_parent, { BookId }, context) => {
            if (context.user) {
                const book = await Book.findOneAndDelete({
                    _id: BookId,
                    BookAuthor: context.user.username,
                });
                if (!book) {
                    throw new AuthenticationError('Book not found or unauthorized.');
                }
                await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { books: Book._id } });
                return Book;
            }
            throw AuthenticationError;
        },
    },
};
export default resolvers;
