"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface StickySectionStackProps {
  children: ReactNode[];
  className?: string;
}

/**
 * StickySectionStack
 * Provides a true stacked card sticky scroll transition across major page sections:
 * - Genuine sticky positioning (position: sticky; top: 0)
 * - Tilted card effect on scroll (alternating tilt angles)
 * - Visible rounded corners with crisp border and deep elevation
 * - Zero blackout: Previous section remains fully readable, opaque and bright
 * - Next section slides over the stuck card like a deck of playing cards
 */
export default function StickySectionStack({
  children,
  className,
}: StickySectionStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sectionElements = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    const totalSections = sectionElements.length;

    if (totalSections <= 1 || !containerRef.current) return;

    // Track created triggers for cleanup
    const activeTriggers: ScrollTrigger[] = [];

    sectionElements.forEach((currentSection, i) => {
      // Ensure sticky positioning and stacking context
      gsap.set(currentSection, {
        position: "sticky",
        top: 0,
        zIndex: i + 1,
        transformOrigin: "center center",
      });

      if (i === totalSections - 1) return; // Last section doesn't transition out

      const nextSection = sectionElements[i + 1];

      // Alternating subtle tilt: -2.5deg, +2.5deg, -2.5deg...
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const tiltAngle = (i % 2 === 0 ? -1 : 1) * (isMobile ? 1.5 : 2.5);
      const targetScale = isMobile ? 0.92 : 0.88;
      const cornerRadius = isMobile ? "1.75rem" : "2.5rem";

      // Top elevation shadow on the next section as it slides up over the tilted card
      gsap.set(nextSection, {
        boxShadow: "0px -25px 60px rgba(0, 0, 0, 0.45)",
      });

      // Scrub animation: Section shrinks into a tilted rounded card as next section arrives
      const tween = gsap.fromTo(
        currentSection,
        {
          scale: 1,
          rotation: 0,
          borderRadius: "0px",
          boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          opacity: 1,
          filter: "brightness(1)",
        },
        {
          scale: targetScale,
          rotation: tiltAngle, // Tilts the card on scroll
          opacity: 1, // DO NOT BLACK OUT: remains 100% visible and readable
          borderRadius: cornerRadius, // Visibly rounded corners
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 3px #171717", // Crisp card border + shadow
          filter: "brightness(1)", // Fully bright — never dims to black
          ease: "none",
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom", // Begins as next section enters viewport from bottom
            end: "top top",      // Completes when next section reaches top and covers current
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      if (tween.scrollTrigger) {
        activeTriggers.push(tween.scrollTrigger);
      }
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      activeTriggers.forEach((trigger) => trigger.kill());
    };
  }, [children.length]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full bg-[#18181b]", className)}
      style={{ perspective: "1200px" }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          style={{
            position: "sticky",
            top: 0,
            zIndex: index + 1,
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            isolation: "isolate",
          }}
          className="w-full min-h-screen will-change-transform overflow-hidden flex flex-col justify-center"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
