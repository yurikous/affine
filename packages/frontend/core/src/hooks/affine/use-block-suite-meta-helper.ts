import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { useDocMetaHelper } from '@affine/core/hooks/use-block-suite-page-meta';
import { useDocCollectionHelper } from '@affine/core/hooks/use-block-suite-workspace-helper';
import { CollectionService } from '@affine/core/modules/collection';
import { DocsService, useService } from '@toeverything/infra';
import { useCallback } from 'react';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';

import type { DocCollection } from '../../shared';
import { useNavigateHelper } from '../use-navigate-helper';

export function useBlockSuiteMetaHelper(docCollection: DocCollection) {
  const { setDocMeta, getDocMeta, setDocReadonly, setDocTitle } =
    useDocMetaHelper(docCollection);
  const { createDoc } = useDocCollectionHelper(docCollection);
  const { openPage } = useNavigateHelper();
  const collectionService = useService(CollectionService);
  const pageRecordList = useService(DocsService).list;

  // TODO-Doma
  // "Remove" may cause ambiguity here. Consider renaming as "moveToTrash".
  const removeToTrash = useCallback(
    (pageId: string) => {
      setDocMeta(pageId, {
        trash: true,
        trashDate: Date.now(),
      });
      setDocReadonly(pageId, true);
      collectionService.deletePagesFromCollections([pageId]);
    },
    [collectionService, setDocMeta, setDocReadonly]
  );

  const restoreFromTrash = useCallback(
    (pageId: string) => {
      setDocMeta(pageId, {
        trash: false,
        trashDate: undefined,
      });
      setDocReadonly(pageId, false);
    },
    [setDocMeta, setDocReadonly]
  );

  const permanentlyDeletePage = useCallback(
    (pageId: string) => {
      docCollection.removeDoc(pageId);
    },
    [docCollection]
  );

  /**
   * see {@link useBlockSuiteWorkspacePageIsPublic}
   */
  const publicPage = useCallback(
    (pageId: string) => {
      setDocMeta(pageId, {
        isPublic: true,
      });
    },
    [setDocMeta]
  );

  /**
   * see {@link useBlockSuiteWorkspacePageIsPublic}
   */
  const cancelPublicPage = useCallback(
    (pageId: string) => {
      setDocMeta(pageId, {
        isPublic: false,
      });
    },
    [setDocMeta]
  );

  const duplicate = useAsyncCallback(
    async (pageId: string, openPageAfterDuplication: boolean = true) => {
      const currentPageMode = pageRecordList.doc$(pageId).value?.mode$.value;
      const currentPageMeta = getDocMeta(pageId);
      const newPage = createDoc();
      const currentPage = docCollection.getDoc(pageId);

      newPage.load();
      if (!currentPageMeta || !currentPage) {
        return;
      }

      const update = encodeStateAsUpdate(currentPage.spaceDoc);
      applyUpdate(newPage.spaceDoc, update);

      setDocMeta(newPage.id, {
        tags: currentPageMeta.tags,
      });

      const lastDigitRegex = /\((\d+)\)$/;
      const match = currentPageMeta.title.match(lastDigitRegex);
      const newNumber = match ? parseInt(match[1], 10) + 1 : 1;

      const newPageTitle =
        currentPageMeta.title.replace(lastDigitRegex, '') + `(${newNumber})`;

      pageRecordList.doc$(newPage.id).value?.setMode(currentPageMode || 'page');
      setDocTitle(newPage.id, newPageTitle);
      openPageAfterDuplication && openPage(docCollection.id, newPage.id);
    },
    [
      docCollection,
      createDoc,
      getDocMeta,
      openPage,
      pageRecordList,
      setDocMeta,
      setDocTitle,
    ]
  );

  return {
    publicPage,
    cancelPublicPage,

    removeToTrash,
    restoreFromTrash,
    permanentlyDeletePage,

    duplicate,
  };
}
