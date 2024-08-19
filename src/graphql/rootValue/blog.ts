import { db } from "../../lib/db";
import { authenticate } from "../../middleware/auth-middleware";

export const blogRootValue = {
  async blogs({ page, pageSize }: { page?: number; pageSize?: number }) {
    const defaultPageSize = 10;
    if (!pageSize) {
      pageSize = defaultPageSize;
    }

    if (!page) {
      page = 0;
    }

    const blogs = db.blog.findMany({
      skip: page * pageSize,
      take: pageSize,
    });

    return blogs;
  },
  async blog({ id }: { id: number }) {
    return await db.blog.findUnique({ where: { id } });
  },
  async createBlog({ input }: { input: any }) {
    authenticate(async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("User not found");
      }

      return await db.blog.create({
        data: {
          ...input,
          authorId: context.user.id,
        },
      });
    });
  },
  async updateBlog({ input }: { input: any }) {
    authenticate(async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("User not found");
      }

      const blog = db.blog.update({
        where: { id: input.id, authorId: context.user.id },
        data: {
          ...input,
          authorId: context.user.id,
        },
      });

      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    });
  },

  async deleteBlog({ id }: { id: number }) {
    authenticate(async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("User not found");
      }

      const blog = db.blog.delete({
        where: { id, authorId: context.user.id },
      });

      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    });
  },
};
