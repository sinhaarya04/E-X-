"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [time, setTime] = useState("");
  const linksRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " ET"
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  function closeMenu() {
    linksRef.current?.classList.remove("open");
    overlayRef.current?.classList.remove("open");
    toggleRef.current?.setAttribute("aria-expanded", "false");
  }

  function handleToggle() {
    const open = linksRef.current?.classList.toggle("open");
    overlayRef.current?.classList.toggle("open");
    toggleRef.current?.setAttribute("aria-expanded", String(!!open));
  }

  return (
    <nav className="nav" aria-label="Main navigation">
      <a href="#" className="nav-brand">
        <span className="nav-logo">
          E[X]<span> // Terminal</span>
        </span>
      </a>
      <button
        ref={toggleRef}
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded="false"
        onClick={handleToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div ref={overlayRef} className="nav-overlay" onClick={closeMenu}></div>
      <ul ref={linksRef} className="nav-links" role="list">
        <li>
          <a href="#tracker" onClick={closeMenu}>
            Home
          </a>
        </li>
        <li>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
        </li>
        <li>
          <span className="nav-time">{time}</span>
        </li>
        <li>
          <a href="/login" className="nav-links-a" onClick={closeMenu}>
            Log in
          </a>
        </li>
        <li>
          <a href="/signup" className="nav-cta" onClick={closeMenu}>
            Sign Up
          </a>
        </li>
      </ul>
    </nav>
  );
}
