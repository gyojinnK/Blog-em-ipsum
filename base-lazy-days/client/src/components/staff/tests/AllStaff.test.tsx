import { AllStaff } from "../AllStaff";

import { render, screen } from "@/test-utils";

test("renders response from query", async () => {
  render(<AllStaff />);

  const allStaff = await screen.findAllByRole("heading", {
    name: /sandra|divya|mateo|michael/i,
  });

  expect(allStaff).toHaveLength(4);
});
