import '@testing-library/jest-dom';
import { unmountComponentAtNode } from 'react-dom';

export let container: HTMLDivElement | null = null;
let originalError: any = null;

beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
});

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    if (container != null) {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    }
});

afterAll(() => {
    console.error = originalError;
});