import { Post } from 'src/modules/post/entities/post.entity';
import { DataSource } from 'typeorm';

export async function PostSeeders(dataSource: DataSource) {
  const postRepository = dataSource.getRepository(Post);
  console.log('Seeding Post');

  const posts = [
    {
      title: 'Post 1 ',
      content: 'The content',
      user_id: 1,
    },
    {
      title: 'Post 2 ',
      content: 'The content',
      user_id: 2,
    },
    {
      title: 'Post 3 ',
      content: 'The content',
      user_id: 3,
    },
  ];
  for (const post of posts) {
    const existPost = await postRepository.findOne({
      where: { title: post.title },
    });
    if (!existPost) {
      await postRepository.save(post);
      console.log(`✅ Post"${post.title}" created`);
    } else {
      console.log(`⚠️  Post"${post.title}" already exists`);
    }
  }
  console.log('Posts seeding finished');
}
