import { unmountComponentAtNode } from "react-dom";
const { ResizeObserver } = window;

let container = null;
beforeEach(() => {
  //mocking ResizeObserver (used by ResponsiveContainer from recharts )
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  window.ResizeObserver = ResizeObserver;

  jest.restoreAllMocks();

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});