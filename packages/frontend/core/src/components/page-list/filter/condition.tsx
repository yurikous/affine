import { Menu, MenuItem, Tooltip } from '@affine/component';
import type { Filter, Literal, PropertiesMeta } from '@affine/env/filter';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { FilterTag } from './filter-tag-translation';
import * as styles from './index.css';
import { literalMatcher } from './literal-matcher';
import { tBoolean } from './logical/custom-type';
import type { TFunction, TType } from './logical/typesystem';
import { typesystem } from './logical/typesystem';
import { variableDefineMap } from './shared-types';
import { filterMatcher, VariableSelect, vars } from './vars';

export const Condition = ({
  value,
  onChange,
  propertiesMeta,
}: {
  value: Filter;
  onChange: (filter: Filter) => void;
  propertiesMeta: PropertiesMeta;
}) => {
  const data = useMemo(() => {
    const data = filterMatcher.find(v => v.data.name === value.funcName);
    if (!data) {
      return;
    }
    const instance = typesystem.instance(
      {},
      [variableDefineMap[value.left.name].type(propertiesMeta)],
      tBoolean.create(),
      data.type
    );
    return {
      render: data.data.render,
      type: instance,
    };
  }, [propertiesMeta, value.funcName, value.left.name]);
  if (!data) {
    return null;
  }
  const render =
    data.render ??
    (({ ast }) => {
      const args = renderArgs(value, onChange, data.type);
      return (
        <div className={styles.filterContainerStyle}>
          <Menu
            items={
              <VariableSelect
                propertiesMeta={propertiesMeta}
                selected={[]}
                onSelect={onChange}
              />
            }
          >
            <div
              data-testid="variable-name"
              className={clsx(styles.filterTypeStyle, styles.ellipsisTextStyle)}
            >
              <Tooltip content={ast.left.name}>
                <div className={styles.filterTypeIconStyle}>
                  {variableDefineMap[ast.left.name].icon}
                </div>
              </Tooltip>
              <FilterTag name={ast.left.name} />
            </div>
          </Menu>
          <Menu
            items={
              <FunctionSelect
                propertiesMeta={propertiesMeta}
                value={value}
                onChange={onChange}
              />
            }
          >
            <div
              className={clsx(styles.switchStyle, styles.ellipsisTextStyle)}
              data-testid="filter-name"
            >
              <FilterTag name={ast.funcName} />
            </div>
          </Menu>
          {args}
        </div>
      );
    });
  return <>{render({ ast: value })}</>;
};

const FunctionSelect = ({
  value,
  onChange,
  propertiesMeta,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
  propertiesMeta: PropertiesMeta;
}) => {
  const list = useMemo(() => {
    const type = vars.find(v => v.name === value.left.name)?.type;
    if (!type) {
      return [];
    }
    return filterMatcher.allMatchedData(type(propertiesMeta));
  }, [propertiesMeta, value.left.name]);
  return (
    <div data-testid="filter-name-select">
      {list.map(v => (
        <MenuItem
          onClick={() => {
            onChange({
              ...value,
              funcName: v.name,
              args: v.defaultArgs().map(v => ({ type: 'literal', value: v })),
            });
          }}
          key={v.name}
        >
          <FilterTag name={v.name} />
        </MenuItem>
      ))}
    </div>
  );
};

export const Arg = ({
  type,
  value,
  onChange,
}: {
  type: TType;
  value: Literal;
  onChange: (lit: Literal) => void;
}) => {
  const data = useMemo(() => literalMatcher.match(type), [type]);
  if (!data) {
    return null;
  }
  return (
    <div
      data-testid="filter-arg"
      className={clsx(styles.argStyle, styles.ellipsisTextStyle)}
    >
      {data.render({
        type,
        value: value?.value,
        onChange: v => onChange({ type: 'literal', value: v }),
      })}
    </div>
  );
};
export const renderArgs = (
  filter: Filter,
  onChange: (value: Filter) => void,
  type: TFunction
): ReactNode => {
  const rest = type.args.slice(1);
  return rest.map((argType, i) => {
    const value = filter.args[i];
    return (
      <Arg
        key={i}
        type={argType}
        value={value}
        onChange={value => {
          const args = type.args.map((_, index) =>
            i === index ? value : filter.args[index]
          );
          onChange({
            ...filter,
            args,
          });
        }}
      ></Arg>
    );
  });
};
