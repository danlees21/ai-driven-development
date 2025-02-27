# Drizzle ORM과 Supabase 연결 가이드

이 문서는 Next.js 프로젝트에서 Drizzle ORM을 사용하여 Supabase 데이터베이스에 연결하는 방법을 설명합니다. 공식 매뉴얼과 실제 구현 사이의 차이점도 함께 설명합니다.

## 목차

1. [필요 패키지 설치](#1-필요-패키지-설치)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 연결 설정](#3-데이터베이스-연결-설정)
4. [스키마 정의](#4-스키마-정의)
5. [Drizzle 설정 파일 생성](#5-drizzle-설정-파일-생성)
6. [마이그레이션 파일 생성](#6-마이그레이션-파일-생성)
7. [마이그레이션 실행](#7-마이그레이션-실행)
8. [데이터베이스 작업 예제](#8-데이터베이스-작업-예제)
9. [API 엔드포인트 구현](#9-api-엔드포인트-구현)
10. [공식 매뉴얼과의 차이점](#10-공식-매뉴얼과의-차이점)

## 1. 필요 패키지 설치

다음 패키지들을 설치합니다:

```bash
# 기본 패키지 설치
npm i drizzle-orm postgres dotenv

# 개발 의존성 패키지 설치
npm i -D drizzle-kit tsx
```

## 2. 환경 변수 설정

`.env.local` 파일에 Supabase 데이터베이스 연결 문자열을 추가합니다:

```
# Supabase 데이터베이스 연결 문자열 (Connection Pooling URL 사용)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

> **중요**: Supabase 대시보드의 Project Settings > Database > Connection Pooling 섹션에서 연결 문자열을 확인하세요. 일반 연결 문자열이 아닌 Connection Pooling URL을 사용해야 합니다.

## 3. 데이터베이스 연결 설정

`db` 디렉토리를 생성하고 `index.ts` 파일을 생성합니다:

```bash
mkdir -p db
```

`db/index.ts` 파일에 다음 내용을 추가합니다:

```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// .env 또는 .env.local 파일에서 환경 변수 로드
config({ path: '.env.local' });

// Postgres 클라이언트 생성 (prepare: false 옵션 추가 - Connection Pooling에 필요)
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

// Drizzle ORM 인스턴스 생성
export const db = drizzle(client);
```

> **중요**: Connection Pooling을 사용할 때는 `prepare: false` 옵션이 필수입니다.

## 4. 스키마 정의

`db/schema.ts` 파일을 생성하여 데이터베이스 스키마를 정의합니다:

```typescript
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
```

## 5. Drizzle 설정 파일 생성

프로젝트 루트에 `drizzle.config.ts` 파일을 생성합니다:

```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 6. 마이그레이션 파일 생성

마이그레이션 파일을 저장할 디렉토리를 생성하고, Drizzle Kit을 사용하여 마이그레이션 파일을 생성합니다:

```bash
mkdir -p supabase/migrations
npx drizzle-kit generate
```

이 명령어는 `supabase/migrations` 디렉토리에 SQL 마이그레이션 파일을 생성합니다.

## 7. 마이그레이션 실행

마이그레이션을 실행하기 위한 스크립트 파일을 생성합니다:

`db/migrate.ts` 파일을 생성합니다:

```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// .env 또는 .env.local 파일에서 환경 변수 로드
config({ path: '.env.local' });

// 마이그레이션 실행 함수
async function runMigration() {
  // 마이그레이션용 Postgres 클라이언트 생성 (마이그레이션 전용)
  // prepare: false 옵션 추가 - Connection Pooling에 필요
  const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
  
  // Drizzle ORM 인스턴스 생성
  const db = drizzle(migrationClient);
  
  // 마이그레이션 실행
  console.log('마이그레이션 시작...');
  
  try {
    await migrate(db, { migrationsFolder: 'supabase/migrations' });
    console.log('마이그레이션 완료!');
  } catch (error) {
    console.error('마이그레이션 오류:', error);
  } finally {
    // 연결 종료
    await migrationClient.end();
  }
}

// 마이그레이션 실행
runMigration();
```

`package.json` 파일에 마이그레이션 스크립트를 추가합니다:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx db/migrate.ts"
}
```

마이그레이션을 실행합니다:

```bash
npm run db:migrate
```

## 8. 데이터베이스 작업 예제

`db/example.ts` 파일을 생성하여 데이터베이스 작업 예제를 구현합니다:

```typescript
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
```

## 9. API 엔드포인트 구현

Next.js의 Route Handler를 사용하여 API 엔드포인트를 구현합니다:

`app/api/users/route.ts` 파일을 생성합니다:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, getUserById } from '@/db/example';

// GET /api/users - 모든 사용자 조회
export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return NextResponse.json(
      { error: '사용자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/users - 새 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const { name, age, email } = await request.json();
    
    // 필수 필드 검증
    if (!name || !age || !email) {
      return NextResponse.json(
        { error: '이름, 나이, 이메일은 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    const newUser = await createUser(name, age, email);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    return NextResponse.json(
      { error: '사용자 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

`app/api/users/[id]/posts/route.ts` 파일을 생성합니다:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPostsByUserId } from '@/db/example';

// GET /api/users/[id]/posts - 특정 사용자의 모든 게시물 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }
    
    const posts = await getPostsByUserId(userId);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    return NextResponse.json(
      { error: '게시물 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

## 10. 공식 매뉴얼과의 차이점

공식 Drizzle ORM 매뉴얼과 이 가이드의 주요 차이점은 다음과 같습니다:

### 1. Connection Pooling 설정

**매뉴얼:**
```typescript
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

**실제 구현:**
```typescript
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client);
```

**차이점:**
- `prepare: false` 옵션 추가: Supabase의 Connection Pooling을 사용할 때는 이 옵션이 필수입니다.
- `drizzle({ client })` 대신 `drizzle(client)` 사용: 최신 Drizzle ORM 버전에서는 객체 형태가 아닌 직접 클라이언트를 전달하는 방식을 사용합니다.

### 2. 데이터베이스 URL 형식

**매뉴얼:**
```
DATABASE_URL=<YOUR_DATABASE_URL>
```

**실제 구현:**
```
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

**차이점:**
- 매뉴얼에서는 일반 연결 문자열을 사용하지만, 실제로는 Connection Pooling URL을 사용해야 합니다.
- 일반 연결 문자열과 Connection Pooling URL의 호스트 이름과 포트 번호가 다릅니다.

### 3. 마이그레이션 실행 방식

**매뉴얼:**
```
npx drizzle-kit migrate
```

**실제 구현:**
```typescript
// db/migrate.ts 파일 생성
import { migrate } from 'drizzle-orm/postgres-js/migrator';
// ...
await migrate(db, { migrationsFolder: 'supabase/migrations' });
```

**차이점:**
- 매뉴얼에서는 `drizzle-kit migrate` 명령어를 사용하지만, 실제로는 프로그래밍 방식으로 마이그레이션을 실행했습니다.
- 이 방식은 더 유연하고 오류 처리가 가능하며, 특히 Connection Pooling 설정이 필요한 경우에 더 적합합니다.

### 4. 타입 정의 방식

**매뉴얼:**
```typescript
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
```

**실제 구현:**
```typescript
export type IInsertUser = typeof usersTable.$inferInsert;
export type ISelectUser = typeof usersTable.$inferSelect;
```

**차이점:**
- 인터페이스 이름에 'I' 접두사를 추가했습니다. 이는 프로젝트의 명명 규칙에 따른 것입니다.

### 5. 디렉토리 구조

**매뉴얼:**
```
src/db/index.ts
src/db/schema.ts
```

**실제 구현:**
```
db/index.ts
db/schema.ts
db/migrate.ts
db/example.ts
```

**차이점:**
- `src` 디렉토리를 사용하지 않고 루트에 `db` 디렉토리를 생성했습니다.
- 추가로 `migrate.ts`와 `example.ts` 파일을 생성하여 마이그레이션 실행과 데이터베이스 작업 예제를 구현했습니다.

## 결론

Drizzle ORM과 Supabase를 연결할 때 가장 중요한 차이점은 Connection Pooling 설정과 올바른 연결 문자열 사용입니다. 매뉴얼은 기본적인 가이드라인을 제공하지만, 실제 환경에서는 추가적인 설정이 필요할 수 있습니다.

이 가이드를 따라 설정하면 Drizzle ORM을 사용하여 Supabase 데이터베이스에 성공적으로 연결할 수 있습니다. 