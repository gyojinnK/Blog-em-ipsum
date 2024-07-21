import { ChakraProvider } from "@chakra-ui/react";
import { render as RtlRender } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClientOptions } from "@/react-query/queryClient";

// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  // 여기서도 테스트와 클라이언트 간의 상호작용을 방지하기 위함으로 새로운 쿼리 클라이언트를 생성
  const queryClient = generateQueryClient();
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// 각 테스트에 unique한 쿼리 클라이언트를 생성하는 함수
const generateQueryClient = () => {
  queryClientOptions.defaultOptions.queries.retry = false;
  return new QueryClient(queryClientOptions);

  // What we do?
  // 1. 생산 환경의 쿼리 클라이언트에서 queryClientOptions 추가. 이는 Toast를 던지는 'on error' 핸들러를 가짐
  // 2. 재시도 때문에 테스트가 시간 초과되지 않도록 retry를 'false'로 설정
};

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateQueryClient();

  return RtlRender(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
