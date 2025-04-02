const axios = require('axios');

const TEST_SERVER = 'http://20.244.56.144/evaluation-service';


async function fetchUsers() {
  try {
    const response = await axios.get(`${TEST_SERVER}/users`);
    return response.data.users || [];
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    return [];
  }
}


async function fetchUserPosts(userId) {
  try {
    const response = await axios.get(`${TEST_SERVER}/users/${userId}/posts`);
    return response.data.posts || [];
  } catch (error) {
    console.error(`Failed to fetch posts for user ${userId}:`, error.message);
    return [];
  }
}


async function fetchPostComments(postId) {
  try {
    const response = await axios.get(`${TEST_SERVER}/posts/${postId}/comments`);
    return response.data.comments || [];
  } catch (error) {
    console.error(`Failed to fetch comments for post ${postId}:`, error.message);
    return [];
  }
}


async function getTopUsers() {
  const users = await fetchUsers();
  const usersWithPostCount = await Promise.all(
    users.map(async (user) => {
      const posts = await fetchUserPosts(user.id);
      return { ...user, postCount: posts.length };
    })
  );


  return usersWithPostCount
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5);
}


async function getTopPosts(type) {
  const users = await fetchUsers();
  let allPosts = [];

  for (const user of users) {
    const posts = await fetchUserPosts(user.id);
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const comments = await fetchPostComments(post.id);
        return { ...post, commentCount: comments.length };
      })
    );
    allPosts.push(...postsWithDetails);
  }

  if (type === 'popular') {
   
    const maxComments = Math.max(...allPosts.map(p => p.commentCount));
    return allPosts.filter(post => post.commentCount === maxComments);
  } else {
  
    return allPosts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }
}

module.exports = { getTopUsers, getTopPosts };