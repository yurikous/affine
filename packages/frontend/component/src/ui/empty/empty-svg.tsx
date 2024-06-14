import { memo } from 'react';

export const EmptySvg = memo(function EmptySvg({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="248"
      height="216"
      viewBox="0 0 248 216"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M124.321 4.45459L5.2627 210.669H243.379L124.321 4.45459ZM239.666 207.565L182.825 109.114L125.984 141.931L239.666 207.565ZM125.153 140.49L181.993 107.673L125.153 9.22248L125.153 140.49ZM123.489 9.22248L123.489 140.49L66.6484 107.673L123.489 9.22248ZM65.8166 109.114L8.97592 207.565L122.657 141.931L65.8166 109.114ZM123.489 143.372L9.80773 209.006H123.489V143.372ZM125.153 209.006H238.834L125.153 143.372L125.153 209.006Z"
        fillOpacity="0.3"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M124.283 208.367C161.062 208.367 190.89 178.415 190.89 141.452C190.89 104.489 161.062 74.5371 124.283 74.5371C87.5044 74.5371 57.6765 104.489 57.6765 141.452C57.6765 178.415 87.5044 208.367 124.283 208.367ZM124.283 210.031C161.988 210.031 192.553 179.327 192.553 141.452C192.553 103.577 161.988 72.8735 124.283 72.8735C86.5785 72.8735 56.0129 103.577 56.0129 141.452C56.0129 179.327 86.5785 210.031 124.283 210.031Z"
        fillOpacity="0.3"
      />
      <circle cx="65.7267" cy="107.881" r="4.93369" fillOpacity="0.8" />
      <circle cx="5.26255" cy="210.014" r="4.93369" fillOpacity="0.8" />
      <circle cx="124.359" cy="210.014" r="4.93369" fillOpacity="0.8" />
      <circle cx="243.06" cy="210.014" r="4.93369" fillOpacity="0.8" />
      <circle cx="183.499" cy="107.881" r="4.93369" fillOpacity="0.8" />
      <circle cx="124.396" cy="141.83" r="4.93369" fillOpacity="0.8" />
      <circle cx="124.344" cy="5.00449" r="4.93369" fillOpacity="0.8" />
    </svg>
  );
});
