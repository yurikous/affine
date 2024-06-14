import { toast } from '@affine/component';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import type { DocCollection } from '@blocksuite/store';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { trashModalAtom } from '../../atoms/trash-modal';
import { useBlockSuiteMetaHelper } from './use-block-suite-meta-helper';

export function useTrashModalHelper(docCollection: DocCollection) {
  const t = useAFFiNEI18N();
  const [trashModal, setTrashModal] = useAtom(trashModalAtom);
  const { pageIds } = trashModal;
  const { removeToTrash } = useBlockSuiteMetaHelper(docCollection);

  const handleOnConfirm = useCallback(() => {
    pageIds.forEach(pageId => {
      removeToTrash(pageId);
    });
    toast(t['com.affine.toastMessage.movedTrash']());
    setTrashModal({ ...trashModal, open: false });
  }, [pageIds, removeToTrash, setTrashModal, t, trashModal]);

  return {
    trashModal,
    setTrashModal,
    handleOnConfirm,
  };
}
