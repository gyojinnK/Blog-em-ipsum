# isFetching VS isLoading

- isFetching
  - 비동기 쿼리가 아직 해결되지 않았다는 것
  - 아직 fetch가 완료되지 않았지만, Axios 호출이나 GraphQL 호출 같은 다른 종류의 데이터를 가져오는 작업일 수 있다.
- isLoading
  - 비동기 쿼리가 실행되고 쿼리가 성공하기 전의 상황
  - 즉, 쿼리의 완료를 기다리는 상황
  - ex\_ 데이터 Fetching 로직이 동작하고 데이터를 받아오기 이전의 상황

> isLoading은 isFetching의 하위 집합!

# Stale Data

## Stale Data란?

- 유효기간이 만료된 데이터(오래된 데이터)
- 데이터가 stale로 표시돼도 캐시에서 삭제된 건 아님
- 단지 데이터를 다시 굼증해야 한다는 뜻.
- Vercel에서 만든 SWR(Stale, While Revalidating)은 서버에서 새 데이터를 가져와 최신 데이터를 보장함

## 데이터 Prefetch는 데이터가 stale일 때만 트리거

- 쿼리를 포함하는 컴포넌트가 다시 마운트 될 때
- 브라우저 창이 리포커싱 할 때
- max age가 만료되었을 때
