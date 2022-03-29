import { Service } from "typedi";
import Blog from "../entities/Blog";
import NotFound from "../utils/errorCode";

@Service()
class BlogService {
  async index() {
    const featuredBlogPromise = Blog.find({
      where: {
        is_featured: true
      }
    });
    const nonFeaturedBlogPromise = Blog.find({
      where: {
        is_featured: false
      }
    });
    const [featuredBlog, nonFeaturedBlog] = await Promise.all([
      featuredBlogPromise, nonFeaturedBlogPromise])

    return {
      featuredBlog,
      nonFeaturedBlog
    }
  }

  async show(blogId: string) {
    const blog = await Blog.findOne(blogId);

    if (!blog) {
      throw new NotFound("Blog not found")
    }

    const recentBlogs = await Blog.createQueryBuilder("blog")
      .select(["blog.id", "blog.title", "blog.feature_image", "blog.created_at"])
      .orderBy("blog.created_at", "ASC")
      .take(4)
      .getMany()

    return {
      blog,
      recentBlogs
    }

  }
}

export default BlogService;
