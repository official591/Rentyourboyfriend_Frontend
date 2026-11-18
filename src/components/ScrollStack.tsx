'use client';

import React from 'react';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
  topOffset?: number;
  zIndex?: number;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ 
  children, 
  itemClassName = '',
  topOffset = 100,
  zIndex = 1
}) => (
  <div 
    className={`scroll-stack-card sticky ${itemClassName}`.trim()}
    style={{ 
      top: `${topOffset}px`,
      zIndex: zIndex
    }}
  >
    {children}
  </div>
);

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  topOffset?: number;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 80,
  itemStackDistance = 28,
  topOffset = 110,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`scroll-stack-wrapper relative w-full ${className}`.trim()}>
      <div className="scroll-stack-inner flex flex-col relative w-full">
        {childrenArray.map((child, index) => {
          if (!React.isValidElement(child)) return child;

          const cardStickyTop = topOffset + index * itemStackDistance;

          return (
            <div 
              key={index} 
              className="w-full relative"
              style={{
                marginBottom: index === childrenArray.length - 1 ? 0 : `${itemDistance}px`
              }}
            >
              {React.cloneElement(child as React.ReactElement<any>, {
                topOffset: cardStickyTop,
                zIndex: index + 10
              })}
            </div>
          );
        })}
        <div className="scroll-stack-end w-full" style={{ height: '12vh' }} />
      </div>
    </div>
  );
};

export default ScrollStack;
