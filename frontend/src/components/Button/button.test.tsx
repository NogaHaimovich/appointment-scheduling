import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders children", () => {
  render(<Button onClick={() => {}}>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});

test("calls onClick when clicked", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText("Click"));
  expect(handleClick).toHaveBeenCalled();
});

test("applies disabled when disabled or loading", () => {
  const { rerender } = render(<Button onClick={() => {}} disabled>Click</Button>);
  expect(screen.getByText("Click")).toBeDisabled();

  rerender(<Button onClick={() => {}} loading>Click</Button>);
  expect(screen.getByText("Loading...")).toBeDisabled();
});

test("shows loading text when loading", () => {
  render(<Button onClick={() => {}} loading>Click</Button>);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("applies variant class", () => {
  render(<Button onClick={() => {}} variant="danger">Click</Button>);
  expect(screen.getByText("Click")).toHaveClass("danger");
});

test("does not call onClick when disabled", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} disabled>Click</Button>);
  fireEvent.click(screen.getByText("Click"));
  expect(handleClick).not.toHaveBeenCalled();
});

test("does not call onClick when loading", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} loading>Click</Button>);
  fireEvent.click(screen.getByText("Loading..."));
  expect(handleClick).not.toHaveBeenCalled();
});

