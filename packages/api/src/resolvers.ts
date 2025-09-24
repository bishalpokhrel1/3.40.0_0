import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      return prisma.user.findUnique({
        where: { id: user.id },
        include: { preferences: true }
      });
    },
    getRecommendedArticles: async (_, __, { user }) => {
      // TODO: Implement article recommendations based on user preferences
      return [];
    },
    getWeather: async (_, { location }) => {
      // TODO: Implement weather service integration
      return {
        location,
        temperature: 0,
        condition: "Unknown",
        forecast: []
      };
    }
  },
  Mutation: {
    signup: async (_, { email, password, name }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          preferences: {
            create: {
              theme: 'light',
              newsCategories: [],
              weatherLocation: null
            }
          }
        },
        include: { preferences: true }
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { preferences: true }
      });

      if (!user) {
        throw new Error('No user found with this email');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token, user };
    },
    updatePreferences: async (_, args, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      return prisma.userPreferences.update({
        where: { userId: user.id },
        data: args
      });
    }
  }
};