import { Button, IconButton, Menu } from '@affine/component';
import type { Filter, PropertiesMeta } from '@affine/env/filter';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { CloseIcon, PlusIcon } from '@blocksuite/icons';

import { Condition } from './condition';
import * as styles from './index.css';
import { CreateFilterMenu } from './vars';

export const FilterList = ({
  value,
  onChange,
  propertiesMeta,
}: {
  value: Filter[];
  onChange: (value: Filter[]) => void;
  propertiesMeta: PropertiesMeta;
}) => {
  const t = useAFFiNEI18N();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
      }}
    >
      {value.map((filter, i) => {
        return (
          <div className={styles.filterItemStyle} key={i}>
            <Condition
              propertiesMeta={propertiesMeta}
              value={filter}
              onChange={filter => {
                onChange(
                  value.map((old, oldIndex) => (oldIndex === i ? filter : old))
                );
              }}
            />
            <div
              className={styles.filterItemCloseStyle}
              onClick={() => {
                onChange(value.filter((_, index) => i !== index));
              }}
            >
              <CloseIcon />
            </div>
          </div>
        );
      })}
      <Menu
        items={
          <CreateFilterMenu
            value={value}
            onChange={onChange}
            propertiesMeta={propertiesMeta}
          />
        }
      >
        {value.length === 0 ? (
          <Button
            icon={<PlusIcon style={{ color: 'var(--affine-icon-color)' }} />}
            iconPosition="end"
            style={{ fontSize: 'var(--affine-font-xs)', padding: '0 8px' }}
          >
            {t['com.affine.filterList.button.add']()}
          </Button>
        ) : (
          <IconButton size="small">
            <PlusIcon />
          </IconButton>
        )}
      </Menu>
    </div>
  );
};
