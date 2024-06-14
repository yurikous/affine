// hack: map var(--affine-tag-xxx) colors to var(--affine-palette-line-xxx)
export const tagColorMap = (color: string) => {
  const mapping: Record<string, string> = {
    'var(--affine-tag-red)': 'var(--affine-palette-line-red)',
    'var(--affine-tag-teal)': 'var(--affine-palette-line-green)',
    'var(--affine-tag-blue)': 'var(--affine-palette-line-blue)',
    'var(--affine-tag-yellow)': 'var(--affine-palette-line-yellow)',
    'var(--affine-tag-pink)': 'var(--affine-palette-line-magenta)',
    'var(--affine-tag-white)': 'var(--affine-palette-line-grey)',
    'var(--affine-tag-gray)': 'var(--affine-palette-line-grey)',
    'var(--affine-tag-orange)': 'var(--affine-palette-line-orange)',
    'var(--affine-tag-purple)': 'var(--affine-palette-line-purple)',
    'var(--affine-tag-green)': 'var(--affine-palette-line-green)',
  };
  return mapping[color] || color;
};
