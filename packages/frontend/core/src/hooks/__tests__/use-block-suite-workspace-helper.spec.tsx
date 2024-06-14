/**
 * @vitest-environment happy-dom
 */
import 'fake-indexeddb/auto';

import { configureTestingEnvironment } from '@affine/core/testing';
import { renderHook } from '@testing-library/react';
import type { FrameworkProvider, Workspace } from '@toeverything/infra';
import {
  FrameworkRoot,
  FrameworkScope,
  initEmptyPage,
} from '@toeverything/infra';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useBlockSuiteDocMeta } from '../use-block-suite-page-meta';
import { useDocCollectionHelper } from '../use-block-suite-workspace-helper';

const configureTestingWorkspace = async () => {
  const { framework, workspace } = await configureTestingEnvironment();
  const docCollection = workspace.docCollection;

  initEmptyPage(docCollection.createDoc({ id: 'page1' }));
  initEmptyPage(docCollection.createDoc({ id: 'page2' }));

  return { framework, workspace };
};

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['requestIdleCallback'] });
});

const getWrapper = (framework: FrameworkProvider, workspace: Workspace) =>
  function Provider({ children }: PropsWithChildren) {
    return (
      <FrameworkRoot framework={framework}>
        <FrameworkScope scope={workspace.scope}>{children}</FrameworkScope>
      </FrameworkRoot>
    );
  };

describe('useDocCollectionHelper', () => {
  test('should create page', async () => {
    const { framework, workspace } = await configureTestingWorkspace();
    const docCollection = workspace.docCollection;
    const Wrapper = getWrapper(framework, workspace);

    expect(docCollection.meta.docMetas.length).toBe(3);
    const helperHook = renderHook(() => useDocCollectionHelper(docCollection), {
      wrapper: Wrapper,
    });
    const pageMetaHook = renderHook(() => useBlockSuiteDocMeta(docCollection), {
      wrapper: Wrapper,
    });
    await new Promise(resolve => setTimeout(resolve));
    expect(pageMetaHook.result.current.length).toBe(3);
    expect(docCollection.meta.docMetas.length).toBe(3);
    const page = helperHook.result.current.createDoc('page4');
    expect(page.id).toBe('page4');
    expect(docCollection.meta.docMetas.length).toBe(4);
    pageMetaHook.rerender();
    expect(pageMetaHook.result.current.length).toBe(4);
  });
});
