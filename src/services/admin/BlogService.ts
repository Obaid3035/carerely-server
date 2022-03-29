import { Service } from "typedi";
import Blog from "../../entities/Blog";
import User from "../../entities/User";
import cloudinary from "../../utils/cloudinary";
import { NotFound } from "../../utils/errorCode";

@Service()
class BlogService {

  async index(skip: number, limit: number) {
    const blogPromise = Blog.createQueryBuilder("blog")
      .skip(skip)
      .take(limit)
      .getMany();

    const blogCountPromise = Blog.createQueryBuilder("blog")
      .getCount()

    const [blog, blogCount] = await Promise.all([blogPromise, blogCountPromise]);

    const formattedBlog = blog.map((blog) => {
      return Object.values(blog)
    });
    return {
      blog: formattedBlog,
      count: blogCount
    }
  }

  async show(blogId: string) {
    const blog = await Blog.findOne(blogId);
    if (!blog) {
      throw new NotFound("Blog not found")
    }
    return blog
  }

  async create(userInput: Blog, user: User, img: any) {
    const uploadedImage = await cloudinary.v2.uploader.upload(img.path);
    const createdBlog = Blog.create({
      user,
      feature_image: {
        avatar: uploadedImage.secure_url,
        cloudinary_id: uploadedImage.public_id
      },
      title: userInput.title,
      text: userInput.text,
      is_featured: userInput.is_featured
    });
    await createdBlog.save();

    return {
      saved: true
    }
  }

  async update(userInput: Blog, blogId: string, file: any) {
    const blog = await Blog.findOne(blogId);
    if (!blog) {
      throw new NotFound("Blog not found")
    }
    blog.title = userInput.title;
    blog.text = userInput.text;
    blog.is_featured = userInput.is_featured;
    if (file) {
      const uploadedImage = await cloudinary.v2.uploader.upload(file.path);
      blog.feature_image = {
        avatar: uploadedImage.secure_url,
        cloudinary_id: uploadedImage.public_id
      }
    }
    await blog.save();
    return {
      message: "Blog updated successfully!"
    }
  }
}

export default BlogService
