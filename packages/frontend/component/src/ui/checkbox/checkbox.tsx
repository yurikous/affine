// components/checkbox.tsx
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import * as icons from './icons';
import * as styles from './index.css';

export type CheckboxProps = Omit<
  HTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  checked: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  animation?: boolean;
  name?: string;
  label?: string;
  inputClassName?: string;
  labelClassName?: string;
};

export const Checkbox = ({
  checked,
  onChange,
  indeterminate,
  disabled,
  animation,
  name,
  label,
  inputClassName,
  labelClassName,
  className,
  ...otherProps
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      onChange(event, newChecked);
      const inputElement = inputRef.current;
      if (newChecked && inputElement && animation) {
        playCheckAnimation(inputElement.parentElement as Element).catch(
          console.error
        );
      }
    },
    [onChange, animation]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  const icon = indeterminate
    ? icons.indeterminate
    : checked
      ? icons.checked
      : icons.unchecked;

  return (
    <div
      className={clsx(styles.root, className, disabled && styles.disabled)}
      role="checkbox"
      {...otherProps}
    >
      {icon}
      <input
        ref={inputRef}
        data-testid="affine-checkbox"
        className={clsx(styles.input, inputClassName)}
        type="checkbox"
        value={checked ? 'on' : 'off'}
        id={name}
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      {label ? (
        <label htmlFor={name} className={clsx(labelClassName)}>
          {label}
        </label>
      ) : null}
    </div>
  );
};

export const playCheckAnimation = async (refElement: Element) => {
  const sparkingEl = document.createElement('div');
  sparkingEl.classList.add('affine-check-animation');
  sparkingEl.style.cssText = `
    position: absolute;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    font-size: inherit;
  `;
  refElement.append(sparkingEl);

  await sparkingEl.animate(
    [
      {
        boxShadow:
          '0 -18px 0 -8px #1e96eb, 16px -8px 0 -8px #1e96eb, 16px 8px 0 -8px #1e96eb, 0 18px 0 -8px #1e96eb, -16px 8px 0 -8px #1e96eb, -16px -8px 0 -8px #1e96eb',
      },
    ],
    { duration: 240, easing: 'ease', fill: 'forwards' }
  ).finished;

  await sparkingEl.animate(
    [
      {
        boxShadow:
          '0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent, 0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent',
      },
    ],
    { duration: 360, easing: 'ease', fill: 'forwards' }
  ).finished;
  sparkingEl.remove();
};
