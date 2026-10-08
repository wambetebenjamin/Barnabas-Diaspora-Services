"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DIASPORA_CITIES, NAIROBI } from "@/lib/data";
import { usePrefersReducedMotion, useDocumentVisible } from "@/lib/motion";

/**
 * EFFECT-01 — WebGL Three.js globe.
 * Animated glowing money-transfer arcs from diaspora cities to a central
 * Nairobi point. Orbitable by drag, arrow keys for keyboard users,
 * poster fallback under reduced motion (rendered by parent CSS/JS).
 */
export function HeroGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || reduced) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.1);

    const globe = new THREE.Group();
    scene.add(globe);

    // Sphere + wire grid
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 48),
      new THREE.MeshPhongMaterial({
        color: 0x0b2352,
        emissive: 0x071633,
        shininess: 12,
        transparent: true,
        opacity: 0.96,
      }),
    );
    globe.add(sphere);

    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 24, 18),
      new THREE.MeshBasicMaterial({ color: 0x355efc, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    globe.add(grid);

    // Atmospheric glow
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x4f7dff, transparent: true, opacity: 0.12, side: THREE.BackSide }),
    );
    scene.add(glow);

    const ambient = new THREE.AmbientLight(0xbfd0ff, 1.1);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(3, 2, 4);
    scene.add(key);

    const toVec = (lat: number, lng: number, radius = 1.015) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    // Nairobi hub
    const hub = toVec(NAIROBI.lat, NAIROBI.lng, 1.02);
    const hubMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x6ee7a8 }),
    );
    hubMarker.position.copy(hub);
    globe.add(hubMarker);

    const hubRing = new THREE.Mesh(
      new THREE.RingGeometry(0.045, 0.062, 32),
      new THREE.MeshBasicMaterial({ color: 0x6ee7a8, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    );
    hubRing.position.copy(hub);
    hubRing.lookAt(new THREE.Vector3(0, 0, 0));
    globe.add(hubRing);

    // Glowing transfer arcs
    const packets: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; offset: number }[] = [];

    for (const city of DIASPORA_CITIES) {
      const from = toVec(city.lat, city.lng, 1.02);
      const mid = from.clone().add(hub).multiplyScalar(0.5).normalize().multiplyScalar(1.32);
      const curve = new THREE.QuadraticBezierCurve3(from, mid, hub);

      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.0065, 6, false),
        new THREE.MeshBasicMaterial({ color: 0x7c9bff, transparent: true, opacity: 0.65 }),
      );
      globe.add(tube);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffd27d }),
      );
      globe.add(dot);
      packets.push({ mesh: dot, curve, offset: Math.random() });

      const origin = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xdfe4fd }),
      );
      origin.position.copy(from);
      globe.add(origin);
    }

    // Interaction — drag orbit + arrow keys
    let rotY = 0.4;
    let rotX = 0.18;
    let velY = 0.0016;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const el = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.005;
      rotX += (e.clientY - lastY) * 0.004;
      rotX = Math.max(-0.9, Math.min(0.9, rotX));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const step = 0.09;
      if (e.key === "ArrowLeft") { rotY -= step; e.preventDefault(); }
      if (e.key === "ArrowRight") { rotY += step; e.preventDefault(); }
      if (e.key === "ArrowUp") { rotX = Math.min(0.9, rotX + step); e.preventDefault(); }
      if (e.key === "ArrowDown") { rotX = Math.max(-0.9, rotX - step); e.preventDefault(); }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("keydown", onKeyDown);
    el.tabIndex = 0;
    el.setAttribute("role", "img");
    el.setAttribute(
      "aria-label",
      "Interactive globe showing money transfer routes from diaspora cities to Nairobi. Use arrow keys or drag to rotate.",
    );

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!dragging) {
        rotY += velY;
      }
      globe.rotation.y = rotY;
      globe.rotation.x = rotX;

      // packets travel along the arcs
      for (const p of packets) {
        const u = (t * 0.12 + p.offset) % 1;
        p.mesh.position.copy(p.curve.getPoint(u));
      }

      // hub pulse
      const pulse = 1 + Math.sin(t * 2.2) * 0.18;
      hubRing.scale.setScalar(pulse);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || 480;
      const h = mount.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("keydown", onKeyDown);
      renderer.dispose();
      if (el.parentElement === mount) mount.removeChild(el);
    };
  }, [reduced]);

  // pause rendering while tab hidden: rotation freeze via visible flag
  useEffect(() => {
    if (!visible) {
      // nothing to cancel — animate() keeps RAF but rendering is cheap;
      // hide the canvas to halt compositing work
      const canvas = mountRef.current?.querySelector("canvas");
      if (canvas) canvas.style.opacity = "0.4";
    } else {
      const canvas = mountRef.current?.querySelector("canvas");
      if (canvas) canvas.style.opacity = "1";
    }
  }, [visible]);

  if (reduced || failed) {
    // poster fallback (EFFECT-01 spec) — static SVG globe
    return (
      <div className="hero-globe-poster" role="img" aria-label="Globe with transfer routes to Nairobi">
        <svg width="320" height="320" viewBox="0 0 320 320" aria-hidden="true">
          <circle cx="160" cy="160" r="118" fill="rgba(1,26,65,0.35)" stroke="#7c9bff" strokeWidth="2" />
          <ellipse cx="160" cy="160" rx="118" ry="44" fill="none" stroke="#7c9bff" opacity="0.5" />
          <ellipse cx="160" cy="160" rx="44" ry="118" fill="none" stroke="#7c9bff" opacity="0.5" />
          <path d="M52 78 Q 120 40 158 152" fill="none" stroke="#ffd27d" strokeWidth="3" />
          <path d="M42 188 Q 110 200 158 168" fill="none" stroke="#ffd27d" strokeWidth="3" />
          <path d="M268 84 Q 210 52 164 150" fill="none" stroke="#ffd27d" strokeWidth="3" />
          <path d="M282 206 Q 220 216 166 172" fill="none" stroke="#ffd27d" strokeWidth="3" />
          <circle cx="160" cy="160" r="8" fill="#6ee7a8" />
        </svg>
      </div>
    );
  }

  return <div ref={mountRef} className="hero-globe-canvas" aria-hidden="false" />;
}
