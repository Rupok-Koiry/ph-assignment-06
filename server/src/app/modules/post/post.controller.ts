import httpStatus from 'http-status';
import APIFeatures from '../../utils/apiFeatures';
import catchAsync from '../../utils/catchAsync';
import * as factory from '../../utils/handlerFactory';
import Post from './post.model';
import Comment from '../comment/comment.model';
import AppError from '../../errors/AppError';
export const createPost = factory.createOne(Post);
export const getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate(
    'author category',
    'name email profilePic',
  );

  if (!post) {
    return next(new AppError(httpStatus.NOT_FOUND, `Post not found`));
  }

  const comments = await Comment.find({ post: id }).populate(
    'author',
    'name email profilePic',
  );
  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: `Posts retrieved successfully`,
    data: {
      ...post.toObject(),
      comments,
    },
  });
});
export const getAllPosts = catchAsync(async (req, res) => {
  // APi features
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // POPULATE

  const posts = await features.query
    .populate('author category', 'name email profilePic')
    .lean();
  // Add total comments to each post
  const postsWithCommentCount = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        totalComments: commentCount,
      };
    }),
  );
  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: `Posts retrieved successfully`,
    data: postsWithCommentCount,
  });
});
export const getMyPosts = catchAsync(async (req, res) => {
  // APi features
  const features = new APIFeatures(
    Post.find({ author: req.user.userId }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // POPULATE
  const posts = await features.query
    .populate('author category', 'name email profilePic')
    .lean();
  // Add total comments to each post
  const postsWithCommentCount = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        totalComments: commentCount,
      };
    }),
  );
  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: `Posts retrieved successfully`,
    data: postsWithCommentCount,
  });
});
export const updatePost = factory.updateOne(Post);
export const deletePost = factory.deleteOne(Post);
