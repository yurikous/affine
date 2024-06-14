import { Empty } from '@affine/component';
import { Trans } from '@affine/i18n';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import type { DocCollection } from '@blocksuite/store';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

import { usePageHelper } from '../../components/blocksuite/block-suite-page-list/utils';
import * as styles from './page-list-empty.css';

export const EmptyPageList = ({
  type,
  docCollection,
  heading,
}: {
  type: 'all' | 'trash' | 'shared' | 'public';
  docCollection: DocCollection;
  heading?: ReactNode;
}) => {
  const { createPage } = usePageHelper(docCollection);
  const t = useAFFiNEI18N();
  const onCreatePage = useCallback(() => {
    createPage?.();
  }, [createPage]);

  const getEmptyDescription = () => {
    if (type === 'all') {
      const createNewPageButton = (
        <button className={styles.emptyDescButton} onClick={onCreatePage}>
          {t['New Page']()}
        </button>
      );
      if (environment.isDesktop) {
        const shortcut = environment.isMacOs ? '⌘ + N' : 'Ctrl + N';
        return (
          <Trans i18nKey="emptyAllPagesClient">
            Click on the {createNewPageButton} button Or press
            <kbd className={styles.emptyDescKbd}>{{ shortcut } as any}</kbd> to
            create your first page.
          </Trans>
        );
      }
      return (
        <Trans i18nKey="emptyAllPages">
          Click on the
          {createNewPageButton}
          button to create your first page.
        </Trans>
      );
    }
    if (type === 'trash') {
      return t['com.affine.workspaceSubPath.trash.empty-description']();
    }
    if (type === 'shared') {
      return t['emptySharedPages']();
    }
    return;
  };

  return (
    <div className={styles.pageListEmptyStyle}>
      {heading && <div>{heading}</div>}
      <Empty
        title={t['com.affine.emptyDesc']()}
        description={getEmptyDescription()}
      />
    </div>
  );
};

export const EmptyCollectionList = ({ heading }: { heading: ReactNode }) => {
  const t = useAFFiNEI18N();
  return (
    <div className={styles.pageListEmptyStyle}>
      {heading && <div>{heading}</div>}
      <Empty title={t['com.affine.emptyDesc.collection']()} />
    </div>
  );
};

export const EmptyTagList = ({ heading }: { heading: ReactNode }) => {
  const t = useAFFiNEI18N();
  return (
    <div className={styles.pageListEmptyStyle}>
      {heading && <div>{heading}</div>}
      <Empty title={t['com.affine.emptyDesc.tag']()} />
    </div>
  );
};
