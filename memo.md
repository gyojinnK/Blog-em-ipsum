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
  > react-query의 staleTime은 기본값이 0이다.
  > -> staleTime을 0으로 기본 설정해서, 늘 데이터가 stale이라고 가정하고 서버에서 다시 가져옴

# gcTime

## staleTime VS gcTime

- staleTime은 데이터를 다시 가져와야 할 때를 알려줌
- gcTime은 데이터를 캐시에 유지할 시간을 결정함
  - 데이터와 연관된 활성 useQuery가 없고 데이터가 현재 페이지에 표시되지 않으면 "cold storage" 상태로 돌입하는데, 쿼리가 캐시에 있으나 사용되진 않고 유효기간이 정해져 있는 것
  - 그 유효기간이 gcTime!
    - gcTime이 지나면 데이터는 캐시에서 사라짐
    - 기본 gcTime은 5분
    - 데이터가 페이지에 표시괸 후부터 시간이 측정된다.
  - gcTime이 지나면 gc처리 -> 리액트 쿼리에서 더 이상 사용할 수 없음

## Example

stale과 gc의 이해를 돕기 위해서 몇가지 예시을 들어보자.

- 데이터가 fresh고, staleTime도 남고, 캐시에도 있으며 gcTime도 지나지 않았다.
  - 트리거가 발생할 때만 refetch하기 때문에 캐시된 데이터를 표시하고, 데이터를 refetch하지 않을 것이다.
- 데이터가 stale이고 캐시에 있다.
  - 데이터가 stale이기 때문에 refetch 트리거가 발생하면 서버에서 새 데이터를 가져올 것이다.
  - 이때, 서버에서 새 데이터를 가져오기 전까지 캐시된 데이터를 보여줄 것이다.
- 데이터가 캐시에 없고, gcTime이 지나 데이터가 삭제되었다.
  - 데이터를 서버에서 새로 가져올 것이다.
  - 하지만 gcTime 지나 데이터가 캐시에 존재하지 않기 때문에 fetching이 완료되기 전에는 어떠한 데이터도 제공할 수 없다.
