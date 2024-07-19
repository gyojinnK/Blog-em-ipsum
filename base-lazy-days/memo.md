# useIsFetching

소규모 앱에서는 `useQuery` 반환 객체에서 `isFetching`을 이용했다.

> reminder!
> `isLoading은 isFetching과 동일하지만 캐시된 데이터가 없다!
so~ `isFetching`은 더 큰 카테고리이고 `isLoading`은 가져오는 작은 카테고리!

## In a larger app

- 더 큰 규모의 앱에서는 로딩 스피너를 표시하는 것이 효과적! (isFetching)
- 쿼리가 데이터를 가져오는 과정에 있는 경우, 중아 집중식 로딩 스피너가 앱 컴포넌트의 일부가 될 것!

## useIsFetching

- 현재 가쟈오기 상태인 쿼리 호출의 수를 나타내는 정수를 반환하는 훅
- 0이면 가져오기 상태가 아님, 0보다 크면 가져오기 중!

> 즉, 각 커스텀 훅에 대해 `isFetching`을 사용할 필요가 없다는 뜻!

# QueryCache default onError callback

- queryClient를 설정할 때 쿼리 캐시를 추가한 다음 `onError`를 이용하여 오류 콜백을 추가
- 오류 콜백은 useQuery에서 발생하는 오류에 관계없이 전달되며 콜백 본문 내에서 오류를 처리할 수 있음

```js
const queryClient = newQueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // _handle the error_
    },
  }),
});
```

# Summary

- query-client 파일을 따로 분리하기 (코드 분리)
  - 확장성을 위해서 앱 컴포넌트가 아닌 자체 파일로 관리하는 것이 이득
- Custom hook을 만들어 모듈화
  - 데이터가 두 개 이상의 컴포넌트에 사용되는 경우를 대비하여 코드를 모듈식으로 유지할 수 있음 (next.js의 action파일과 유사한 개념)
- `loading` 컴포넌트의 중앙 집중화
  - `useIsFetching`: 현재 불러오는 퀴리 수를 반환하는 hook
- error handling의 중앙 집중화
  - `onError` 콜백을 사용하여 에러 발생 시 토스트 UI 제공
    - `onError` 콜백은 새 쿼리 캐시를 생성하고 거기에 `onError` 콜백을 정의하여 queryClient 옵션에 정의

---

# Options for pre-populating data

|        /        |     where to use     | data from | added to cache |
| :-------------: | :------------------: | :-------: | :------------: |
|  prefetchQuery  | `queryClient` method |  server   |       O        |
|  setQueryData   | `queryClient` method |  client   |       O        |
| placeholderData |  `useQuery` option   |  client   |       X        |
|   initialData   |  `useQuery` option   |  client   |       O        |

# Deep dive to Prefetching

- prefetch next page
  - 사용자가 현재 페이지를 보고 있는 동안 다음 페이지를 미리 가져옴
  - 사용자가 다음 페이지 버튼을 클릭할 때까지 기다릴 필요가 없도록 함

## PrefetchQuery

- `PrefetchQuery`는 일회성
- fetch Custom hook에서 함께 작성
  - 같은 쿼리 함수와 쿼리 키를 사용하기 때문!
- Home 컴포넌트에서 만들어둔 Prefetch hook을 호출하는 것이 핵심
  - 데이터가 캐시에 미리 로드되도록!
  - 캐시 시간이 끝나기 전에 사용자가 해당 데이터를 이용하는한, 캐시된 데이터를 표시할 수 있으므로, 개발자가 서버 호출을 할 때까지 사용자가 기다릴 필요가 없음!

# Summary

- `Pre-populating` data options

  - `pre-fetch`, `setQueryData`, `placeholderData`, `initialData`

- 캐시를 미리 채우기 위한, `Pre-fetch`
  - 컴포넌트가 렌더링 되었을 떄
  - 페이지를 업데이트할 때, 다음 페이지를 미리 채우기
- 쿼리 키를 종속성 배열로 취급하기
  - 쿼리가 데이터를 다시 가져오지 않거나 예상한 시점에 새 데이터를 가져오지 않는 상황을 예방

---

# Filtering with the select option

select option을 이용한 filter가 유용한 이유

- 리액트 쿼리는 실제로 이를 최적화하기 때문(불필요한 계산을 줄임)
- 상세 동작

  - 리액트 쿼리는 select 함수의 삼중 등호 비교를 수행
  - 데이터가 마지막으로 데이터를 검색했을 때와 동일하고 select 함수가 동일한 경우 select 함수를 다시 실행시키지 않음 -> 최적화

- 이는 select 함수를 위한 안정적인 함수가 필요하다는 의미
  - 매번 변경되는 익명 함수를 사용할 수 없음
    - 삼중 등호 비교가 실패하게 될 것이기 때문
      > 이때, 익명 함수에서 안정적인 함수를 만들고 싶다면
      > `useCallback` 함수 사용

# Re-fetching

## `Refetching은 왜? 그리고 언제 사용하는가?

- 일반적으로 백그라운드 prefetching을 사용하먄 오래된 데이터를 서버에서 업데이트할 수 있다.
- 기본적으로 오래된 쿼리는 특정 조건에 따라 백그라운드에서 자동으로 리페치
  - 쿼리의 새 인스턴스가 마운트될 때 -> 해당 키가 포함된 쿼리가 처음으로 호출될 때
  - 리액트 컴포넌트를 마운트할 때마다 쿼리 호출
  - 윈도우에 초점이 다시 맞춰질 때
  - 네트워크가 다시 연결된 경우, 오래된 데이터가 업데이트되었는지 확인을 위해서.
  - 구성된 `refetchInterval`이 경과한 경우
    - 이는 사용자 작업이 없는 경우에도 데이터가 최신 상태로 유지되도록 서버를 주기적으로 리페치하여 데이터를 가져오려는 경우

## Refetching 방법

- `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchIntaval`

- 명령형으로 refetch (in `useQuery`)

## Suppressing Re-fetch (리페치 억제)

- stale time 늘리기
  - 캐시 데이터가 오래된(stale) 경우에만 리페치를 트리거하기 때문
- boolean 옵션인 `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect` 중 하나 또는 모두 끄기

> 리페치 억제는 자주 변경되지 않고 약간 오래되어도 사용자에게 큰 영향을 미치지 않는 데이터에 대해서만 수행해야함.
> 네트워크 호출을 효과적으로 줄이는가? _스스로 판단하기_

---

# Global Re-fetching

> 전역에서 리페치 옵션을 관리한다. 필요에 따라 개인화된 옵션을 추가로 설정할 수 있다.

## refetching 옵션을 전역에서 관리하고 적용 방법

- mutation 수행한 후 데이터를 무효화 -> 리페치 트리거
- Global 옵션은 `src/react-query/queryClient.ts`

# Polling과 Auto Refetching

## refetchInterval

# Summary

## 필터링을 위한 select option

- 리액트 쿼리 캐싱을 활용하고 데이터를 다시 필터링하지 않으려면, 삼중 등식 테스트에서 살아남을 수 있는 함수여야 한다.
- 그래서 함수가 안정적인지 확인하기 위해 리액트 `useCallback`을 사용
  ```js
  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => {
      if (filter === "all") return unfilteredStaff;
      return filterByTreatment(unfilteredStaff, filter);
    },
    [filter]
  );
  ```

## Re-fetch 옵션과 Suppressing Re-fetch 옵션

- 해당 옵션들은 전역적으로 추가한 다음, 특정 useQueries 및 prefetch 쿼리 호출에서 Overloading

```js
// 전역 queryClient에 옵션 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분
      refetchOnWindowFocus: false,
    },
  },
  ...
});
```

```js
// 특정 useQueries 및 prefetch 쿼리 호출에서 Overloading
const commonOptions = {
  staleTime: 0,
  gcTime: 30000, // 5분(기본값)
};
...
  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll),
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // 1분
    ...commonOptions,
  });
...
```

## 폴링

`refetchInterval` 옵션

> 서버에서 데이터가 변경되었을 경우를 대비해 일정 간격으로 데이터를 리페치
