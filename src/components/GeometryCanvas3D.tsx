import React, { useState } from 'react';
import { Line3D, CalculationResult3D } from '../utils/spaceGeometry';
import { ZoomIn, ZoomOut, RotateCcw, Box } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface GeometryCanvas3DProps {
  l1: Line3D;
  l2: Line3D;
  calcResult: CalculationResult3D;
  t?: TranslationDictionary;
}

export const GeometryCanvas3D: React.FC<GeometryCanvas3DProps> = ({ l1, l2, calcResult, t }) => {
  const [scale, setScale] = useState(24);
  const [rotationAngle, setRotationAngle] = useState(35); // degrees
  const [elevation, setElevation] = useState(25); // degrees

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const width = 640;
  const height = 380;
  const cx = width / 2;
  const cy = height / 2 + 30;

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationAngle((a) => (a + dx * 0.5 + 360) % 360);
    setElevation((el) => Math.max(-60, Math.min(60, el + dy * 0.3)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setRotationAngle((a) => (a + dx * 0.6 + 360) % 360);
    setElevation((el) => Math.max(-60, Math.min(60, el + dy * 0.4)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Isometric 3D to 2D projection
  const project3D = (x: number, y: number, z: number) => {
    const radA = (rotationAngle * Math.PI) / 180;
    const radE = (elevation * Math.PI) / 180;

    // Rotate around Z axis
    const rx = x * Math.cos(radA) - y * Math.sin(radA);
    const ry = x * Math.sin(radA) + y * Math.cos(radA);
    const rz = z;

    // Project with elevation
    const px = cx + (rx - ry) * Math.cos(Math.PI / 6) * scale;
    const py = cy - (rz * Math.cos(radE) - (rx + ry) * Math.sin(radE) * 0.5) * scale;

    return { x: px, y: py };
  };

  const origin = project3D(0, 0, 0);
  const axisX = project3D(7, 0, 0);
  const axisY = project3D(0, 7, 0);
  const axisZ = project3D(0, 0, 7);

  // Endpoints of lines
  const l1Start = project3D(l1.p.x - l1.v.x * 4, l1.p.y - l1.v.y * 4, l1.p.z - l1.v.z * 4);
  const l1End = project3D(l1.p.x + l1.v.x * 4, l1.p.y + l1.v.y * 4, l1.p.z + l1.v.z * 4);

  const l2Start = project3D(l2.p.x - l2.v.x * 4, l2.p.y - l2.v.y * 4, l2.p.z - l2.v.z * 4);
  const l2End = project3D(l2.p.x + l2.v.x * 4, l2.p.y + l2.v.y * 4, l2.p.z + l2.v.z * 4);

  const p1Screen = project3D(l1.p.x, l1.p.y, l1.p.z);
  const p2Screen = project3D(l2.p.x, l2.p.y, l2.p.z);

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            {t?.canvasTitle || '空间立体几何·3D 直线姿态'}
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
            {calcResult.relation === 'parallel'
              ? '3D 平行线'
              : calcResult.relation === 'skew'
              ? '3D 异面直线'
              : calcResult.relation === 'coincident'
              ? '3D 重合直线'
              : '3D 相交直线'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRotationAngle((a) => (a + 15) % 360)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            旋转 3D
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s * 1.2, 50))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(s / 1.2, 10))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(24);
              setRotationAngle(35);
              setElevation(25);
            }}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="relative w-full h-[300px] sm:h-[360px] bg-white rounded-lg overflow-hidden border border-slate-100 select-none cursor-grab active:cursor-grabbing touch-none"
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <marker id="arrow3d" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* 3D Axes */}
          {/* X Axis */}
          <line x1={origin.x} y1={origin.y} x2={axisX.x} y2={axisX.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow3d)" />
          <text x={axisX.x + 8} y={axisX.y} fontSize="11" fill="#64748b" fontWeight="bold">X</text>

          {/* Y Axis */}
          <line x1={origin.x} y1={origin.y} x2={axisY.x} y2={axisY.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow3d)" />
          <text x={axisY.x - 12} y={axisY.y + 12} fontSize="11" fill="#64748b" fontWeight="bold">Y</text>

          {/* Z Axis */}
          <line x1={origin.x} y1={origin.y} x2={axisZ.x} y2={axisZ.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow3d)" />
          <text x={axisZ.x + 8} y={axisZ.y} fontSize="11" fill="#64748b" fontWeight="bold">Z</text>

          {/* Line 1 (Blue) */}
          <line x1={l1Start.x} y1={l1Start.y} x2={l1End.x} y2={l1End.y} stroke="#2563eb" strokeWidth="2.5" />
          <circle cx={p1Screen.x} cy={p1Screen.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
          <text x={p1Screen.x + 8} y={p1Screen.y - 6} fontSize="11" fill="#1e40af" fontWeight="bold">
            L₁ P₁({l1.p.x}, {l1.p.y}, {l1.p.z})
          </text>

          {/* Line 2 (Emerald) */}
          <line x1={l2Start.x} y1={l2Start.y} x2={l2End.x} y2={l2End.y} stroke="#059669" strokeWidth="2.5" />
          <circle cx={p2Screen.x} cy={p2Screen.y} r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
          <text x={p2Screen.x + 8} y={p2Screen.y + 12} fontSize="11" fill="#065f46" fontWeight="bold">
            L₂ P₂({l2.p.x}, {l2.p.y}, {l2.p.z})
          </text>

          {/* Distance Indicator Segment */}
          {calcResult.distance.decimal > 0 && (
            <g>
              <line
                x1={p1Screen.x}
                y1={p1Screen.y}
                x2={p2Screen.x}
                y2={p2Screen.y}
                stroke="#e11d48"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <g transform={`translate(${(p1Screen.x + p2Screen.x) / 2}, ${(p1Screen.y + p2Screen.y) / 2})`}>
                <rect x="-40" y="-12" width="80" height="22" rx="4" fill="#ffffff" stroke="#e11d48" strokeWidth="1" />
                <text x="0" y="3" fontSize="11" fill="#e11d48" fontWeight="bold" textAnchor="middle">
                  d={calcResult.distance.decimal.toFixed(2)}
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 text-xs shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" />
            <span>L₁: 点P₁ + t·({l1.v.x}, {l1.v.y}, {l1.v.z})</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" />
            <span>L₂: 点P₂ + s·({l2.v.x}, {l2.v.y}, {l2.v.z})</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-rose-600 font-bold">
            <span>最短距离 d ≈ {calcResult.distance.decimal.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
