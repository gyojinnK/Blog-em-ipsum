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

# The Flow

> useInfiniteQuery의 흐름과 다양한 구성 요소를 알아보고 이 모든 것들이 어떻게 서로 상호작용하는지 확인하기

1. 컴포넌트 마운트

- 이 시점에서 useInfiniteQuery에서 반환된 객체의 데이터 속성은 `undefined`
  - 쿼리를 아직 수행하지 않았기 때문

2. useInfiniteQuery는 쿼리 함수를 사용해 첫 페이지를 가져옴

- 함수는 pageParam을 인자로 받음 -> 첫번째 pageParam은 기본값으로 정의한 것이 된다.
- pageParam을 사용하여 첫 페이지를 가져오고, 데이터 반환 객체의 pages 속성을 설정한다.
  - 특히, 배열의 첫 번째 요소를 설정하는데, 이는 인덱스가 0
  - 해당 값은 쿼리 함수가 반환하는 값!

3. 데이터를 받은 후, react-query는 `getNextPageParam`을 실행

- `getNextPageParam`는 마지막 페이지와 모든 페이지를 받아 pageParam을 업데이트

4. `hasNextPage`로 마지막 페이지인지 확인
5. 사용자의 스크롤 / 버튼 클릭으로 다음 페이지 데이터 가져옴
   > 페이지가 `undefined`가 아닐 때까지 3, 4, 5과정 반복

# React Infinite Scroller

- react-infinite-scroller 라이브러리 사용
- 대표적인 2개 props
  - `hasMore={hasNextPage}`
    - 로딩할 데이터가 더 있는지 여부를 나타냄
  - loadMore
    - 무한 스크롤러가 더 많은 데이터를 로딩할 때 실행될 함수
    ```js
    loadMore = { () => {
      if(!isFetching) fetchNextPage();
    }}
    ```
- 무한 스크롤 컴포넌트는 사용자가 페이지의 특정 지점에 도달했을 때 fetchNextPage를 호출
- useInfiniteQuery에서 반환된 객체의 data 속성으로부터 데이터에 접근
  - 이는 배열인 pages 속성을 가짐
    - 따라서 이 pages 배열을 매핑해 페이지에 데이터를 표시할 수 있음
