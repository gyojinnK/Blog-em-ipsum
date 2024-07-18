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
