import { ComponentPropsWithoutRef } from "react";

type WordTileProps = ComponentPropsWithoutRef<"button"> & { 
  selected: boolean;
  bouncing?: boolean;
  shaking?: boolean;
};

export function WordTile({ selected, bouncing = false, shaking = false, ...props }: WordTileProps) {
  return (
    <button
      className={`${selected ? "bg-stone-600 text-stone-50" : "bg-stone-200"} ${bouncing ? "animate-bounce-once" : ""} ${shaking ? "animate-shake-incorrect" : ""} aspect-square break-words rounded-md p-2 text-center font-semibold uppercase leading-none transition active:scale-95 sm:aspect-auto sm:py-6 sm:text-base`}
      {...props}
    />
  );
}
