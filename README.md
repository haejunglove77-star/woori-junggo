# 우리동네중고

이웃끼리 중고 물건을 사고파는 홈페이지(web)와 휴대폰 앱(app)입니다. 모두 무료 서비스로 운영할 수 있어요.

| 폴더 | 내용 | 무료 서비스 |
|---|---|---|
| `web/` | 홈페이지 (Next.js) | Vercel 무료 요금제로 공개 |
| `app/` | 안드로이드·아이폰 앱 (Expo) | Expo Go로 무료 테스트 |
| `supabase/schema.sql` | 회원·상품·사진 저장소 설정 | Supabase 무료 요금제 |

## 지금 되는 기능
- 상품 목록, 검색, 카테고리 필터
- 상품 상세 보기, 판매자 연락 방법 표시
- 회원가입 / 로그인 (이메일)
- 사진과 함께 판매 등록, 내 상품 보기, 상태 변경(판매중·예약중·판매완료), 삭제
- 앱: 상품 목록, 검색, 상세 보기
- Supabase 연결 전에는 "체험 모드"로 예시 상품이 보여요.

## 공개하는 순서
1. **Supabase**: 새 프로젝트 만들기 → SQL Editor에 `supabase/schema.sql` 붙여넣고 Run → Project Settings > API에서 URL과 anon key 복사
2. **GitHub**: 이 폴더를 저장소로 올리기
3. **Vercel**: Add New Project → 저장소 선택 → Root Directory를 `web`으로 → Environment Variables에
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력 → Deploy
4. **앱 테스트**: `app/.env`에 같은 값을 `EXPO_PUBLIC_...` 이름으로 넣고 `npm install && npx expo start` → 휴대폰 Expo Go 앱으로 QR 찍기

## 내 컴퓨터에서 실행
```
cd web && npm install && npm run dev   # http://localhost:3000
```
