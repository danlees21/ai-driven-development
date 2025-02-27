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