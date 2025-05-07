import { render } from "@testing-library/react";
import App from "./App";

// Mock the IconGrid component to avoid socket.io connection issues in tests
jest.mock("./components/IconGrid", () => () => (
  <div data-testid="mock-icon-grid">Mock Icon Grid</div>
));

test("renders without crashing", () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
