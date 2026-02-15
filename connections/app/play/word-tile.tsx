import { ComponentPropsWithoutRef } from "react";

type WordTileProps = ComponentPropsWithoutRef<"button"> & { 
  selected: boolean;
  bouncing?: boolean;
  shaking?: boolean;
};

export function WordTile({ selected, bouncing = false, shaking = false, children, ...props }: WordTileProps) {
  const textLength = typeof children === 'string' ? children.length : 0;
  
  const getTextSizeClass = (length: number) => {
    if (length <= 6) return "text-[1.3em] sm:text-[1.3em]";
    if (length <= 8) return "text-[1.25em] sm:text-[1.25em]";
    if (length <= 10) return "text-[1.15em] sm:text-[1.15em]";
    if (length <= 11) return "text-[1.1em] sm:text-[1.1em]";
    return "sm:text-base";
  };
  
  const textSizeClass = getTextSizeClass(textLength);
  
  return (
    <button
      className={`${selected ? "bg-stone-600 text-stone-50" : "bg-stone-200"} ${bouncing ? "animate-bounce-once" : ""} ${shaking ? "animate-shake-incorrect" : ""} ${textSizeClass} aspect-square break-words rounded-md p-2 text-center font-semibold uppercase leading-none transition active:scale-95 sm:aspect-auto sm:py-6`}
      {...props}
    >
      {children}
    </button>
  );
}
