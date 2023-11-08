import { useRef, useState } from "react";

export const useStateWithRef = <T>(initialValue: T) => {
  const [s, setter] = useState(initialValue);
  const ref = useRef(s);
  ref.current = s;
  return [ref, setter, s] as [
    React.MutableRefObject<T>,
    React.Dispatch<React.SetStateAction<T>>,
    T
  ];
};
