"use client";

import { ArrowUp } from "lucide-react";
import { useEffect } from "react";

export function MoveToTop() {
  return (
    <button
      onClick={() => {
        if (window.scrollY) {
          window.scrollBy({
            top: -window.scrollY,
            behavior: "smooth",
          });
        }
      }}
      className="fixed rounded-lg text-white p-2 z-50 cursor-pointer"
      style={{
        bottom: "50px",
        right: "20px",
        backgroundColor: "rgb(0 0 0 / 0.8)",
      }}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export function AnimateOnScroll() {
  useEffect(() => {
    if (window.scrollY) {
      window.scrollBy({
        top: -window.scrollY,
        behavior: "smooth",
      });
    }
    (function () {
      const elements = document.querySelectorAll(".invisible-animate-scroll");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-scroll");
            observer.unobserve(entry.target);
          }
        });
      });

      elements.forEach((element) => {
        observer.observe(element);
      });
    })();
  }, []);
  return null;
}
