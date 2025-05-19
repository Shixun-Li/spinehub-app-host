import * as React from "react";

function useDebouncedValue<T = any>(
  value: T,
  wait: number,
  options = { leading: false }
) {
  const [_value, setValue] = React.useState(value);
  const mountedRef = React.useRef(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const coolDownRef = React.useRef(false);

  const cancel = () => clearTimeout(timeoutRef.current ?? undefined);

  React.useEffect(() => {
    if (mountedRef.current) {
      if (!coolDownRef.current && options.leading) {
        coolDownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = setTimeout(() => {
          coolDownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  React.useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
}

export { useDebouncedValue };
