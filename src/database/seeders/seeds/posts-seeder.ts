import { Post } from 'src/modules/post/entities/post.entity';
import { DataSource } from 'typeorm';

export async function PostSeeders(dataSource: DataSource) {
  const postRepository = dataSource.getRepository(Post);
  console.log('🧹 Clearing posts table...');
  try {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await postRepository.clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  } catch (error) {
    console.error('Error Clearing Post table', error);
  } finally {
    console.log('✅ Post table cleared successfully');
  }

  const post = [
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
  await postRepository.save(post);
  console.log('Posts seeding finished');
}
