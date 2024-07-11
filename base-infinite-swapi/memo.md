# Shape of useInfiniteQuery Data

## useQuery와 다른 데이터 구조

- useInfiniteQuery의 반환 객체는 `data`와 `pages`

  - pages
    - 각 데이터 페이지를 나타내는 객체의 배열
    - pages 배열의 각 요소는 useQuery를 사용했을 때 각 쿼리에서 받을 수 있는 데이터에 해당
  - pageParams

    - 각 페이지마다 사용하는 파라미터

    > 각 쿼리는 pages 배열의 자신만의 요소를 가지고 있고, 그 요소는 해당 쿼리의 데이터를 나타냄

- pageParams는 검색된 쿼리의 키를 추적함
  - 일반적으로 많이 사용하지 않음

# useInfiniteQuery Syntax

- useQuery의 문법과 다름

## pageParam은 쿼리 함수에 전달되는 매개변수

```js
useInfiniteQuery({
  queryKey: ["sw-people"],
  queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
});

// queryFn(쿼리 함수)는 객체에서 구조 분해된 pageParam을 받게 되고
// 이를 첫번째 URL로 기본 설정된 값으로 초기화함
// -> 이 함수는 이 기본 URL로 설정된 페이지 매개변수를 가져와, 정의한 fetch URL을 이 pageParam에 실행
```

## useInfiniteQuery Options

- `getNextPageParam: (lastPage, allPages)`
  - 마지막 페이지 데이터나 모든 페이지의 데이터에서 다음 페이지를 가져오는 방법을 알려주는 함수
  - `pageParam`의 업데이트를 의미
  - 모든 페이지의 데이터를 사용하거나, 마지막 페이지의 데이터, 특히 next 속성 사용 가능

# useInfiniteQuery Return Object Properties

- `fetchNextPage`
  - 사용자가 더 많은 데이터를 필요로할 때 호출할 수 있는 함수
  - 즉, 더 많은 데이터를 요청하는 버튼을 클릭하거나 무한 스크롤에서 다음 데이터를 가져오는 지점에 도달했을 때 호출
- `hasNextPage`
  - getNextPageParam 함수의 반환 값에 기반
  - 만약 반환 값이 undefined라면, 더 이상 데이터가 없다는 것
    > 즉, 마지막에 도달했을 때 `hasNextPage` 속성은 `false`
- `isFetchingNextPage`
  - 다음 페이지를 가져오는 중인지, 일반적으로 데이터를 가져오는 중인지 구별 가능
