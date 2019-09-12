import React from 'react';
import { create, act } from 'react-test-renderer';

import Search, { url } from './Search';

describe('Search', () => {
  const immediate = () => new Promise((resolve) => setImmediate(resolve));

  const mockJsonPromise = Promise.resolve({
    results: {
      docs: [
        { name: 'Manchester Airport'},
        { name: 'Manchester' },
        { name: 'Manchester - Piccadilly Train Station'},
        { name: 'Ronaldsway Airport' },
        { name: 'Oldham' },
        { name: 'Bolton' }
      ]
    }
  });

  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise
  });

  const mockFetchPromiseNoResults = Promise.resolve({
    json: () => Promise.resolve({
      results: {
        docs: [
          { name: 'No results found' }
        ]
      }
    })
  });

  test('matches snapshot', () => {
    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const output = renderer.toJSON();
    expect(output).toMatchSnapshot();
  });

  test('does not search with 1 character', () => {
    jest.spyOn(global, 'fetch');

    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const instance = renderer.root;
    const input = instance.findByType('input');

    act(() => {
      input.props.onChange({ target: { value: 'M' } });
    });

    expect(global.fetch).toHaveBeenCalledTimes(0);

    expect(renderer.toJSON()).toMatchSnapshot();

    global.fetch.mockClear();
  });

  test('searches with 2 or more characters and displays 6 results', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const instance = renderer.root;
    const input = instance.findByType('input');

    act(() => {
      input.props.onChange({ target: { value: 'Ma' } });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url(6, 'Ma'));

    await act(async () => {
      await immediate();
    });

    expect(renderer.toJSON()).toMatchSnapshot();

    global.fetch.mockClear();
  });

  test('displays "No results found"', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromiseNoResults);

    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const instance = renderer.root;
    const input = instance.findByType('input');

    act(() => {
      input.props.onChange({ target: { value: 'xgdgfgd' } });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url(6, 'xgdgfgd'));

    await act(async () => {
      await immediate();
    });

    expect(renderer.toJSON()).toMatchSnapshot();

    global.fetch.mockClear();
  });

  test('hides results box', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const instance = renderer.root;
    const input = instance.findByType('input');

    act(() => {
      input.props.onChange({ target: { value: 'Ma' } });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url(6, 'Ma'));

    await act(async () => {
      await immediate();
    });

    act(() => {
      input.props.onChange({ target: { value: 'M' } });
    })

    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(renderer.toJSON()).toMatchSnapshot();

    global.fetch.mockClear();
  });

  test('cancels fetch promise', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    let renderer;
    act(() => {
      renderer = create(<Search />);
    });
    const instance = renderer.root;
    const input = instance.findByType('input');

    act(() => {
      input.props.onChange({ target: { value: 'Ma' } });
    });

    act(() => {
      input.props.onChange({ target: { value: 'M' } });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url(6, 'Ma'));

    await act(async () => {
      await immediate();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(renderer.toJSON()).toMatchSnapshot();

    global.fetch.mockClear();
  });
});
