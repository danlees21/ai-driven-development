import { db } from './index';
import { usersTable, postsTable } from './schema';
import { eq } from 'drizzle-orm';

// 사용자 생성 예제
export async function createUser(name: string, age: number, email: string) {
  try {
    const newUser = await db.insert(usersTable).values({
      name,
      age,
      email
    }).returning();
    
    return newUser[0];
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    throw error;
  }
}

// 모든 사용자 조회 예제
export async function getAllUsers() {
  try {
    const users = await db.select().from(usersTable);
    return users;
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }
}

// 특정 사용자 조회 예제
export async function getUserById(id: number) {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user[0];
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }
}

// 게시물 생성 예제
export async function createPost(title: string, content: string, userId: number) {
  try {
    const newPost = await db.insert(postsTable).values({
      title,
      content,
      userId
    }).returning();
    
    return newPost[0];
  } catch (error) {
    console.error('게시물 생성 오류:', error);
    throw error;
  }
}

// 특정 사용자의 모든 게시물 조회 예제
export async function getPostsByUserId(userId: number) {
  try {
    const posts = await db.select().from(postsTable).where(eq(postsTable.userId, userId));
    return posts;
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    throw error;
  }
} 