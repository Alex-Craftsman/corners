import React, { useEffect } from 'react';

import { useDroppable } from '@dnd-kit/core';

import { cn } from '~/lib/util.lib';

export function Droppable({
  className,
  id,
  children,
  disabled,
  onOver,
}: {
  className: string;
  id: string;
  children: React.ReactNode;
  disabled: boolean;
  onOver?: (checkerId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: disabled,
  });

  useEffect(() => {
    if (isOver && onOver) {
      onOver(id);
    }
  }, [id, isOver, onOver]);

  const backgroundClass = isOver ? 'bg-gray-800' : undefined;

  return (
    <div ref={setNodeRef} className={cn(className, backgroundClass)}>
      {children}
    </div>
  );
}
