import '@testing-library/jest-dom';
import { queryByAttribute, render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import Frame from './components/frame';
import "./i18n"

export let container: HTMLDivElement | null = null;
let originalError: any = null;

beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalError;
});

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Frame, ...options });

export const getById = queryByAttribute.bind(null, "id");

export * from '@testing-library/react';
export { customRender as render };