import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 사용자 테이블 정의
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

// 게시물 테이블 정의
export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// 타입 추론을 위한 타입 정의
export type IInsertUser = typeof usersTable.$inferInsert;
export type ISelectUser = typeof usersTable.$inferSelect;
export type IInsertPost = typeof postsTable.$inferInsert;
export type ISelectPost = typeof postsTable.$inferSelect; 