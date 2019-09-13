import "@testing-library/jest-dom/extend-expect";
import { cleanup } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

afterEach(cleanup);

global.fetch = fetchMock;
afterEach(fetch.resetMocks);
