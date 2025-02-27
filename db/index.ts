import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// .env 또는 .env.local 파일에서 환경 변수 로드
config({ path: '.env.local' });

// Postgres 클라이언트 생성 (prepare: false 옵션 추가 - Connection Pooling에 필요)
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

// Drizzle ORM 인스턴스 생성
export const db = drizzle(client); 