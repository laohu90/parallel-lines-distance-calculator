import React, { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Crosshair } from 'lucide-react';
import { CalculationResult, LineEquation } from '../utils/parallelGeometry';
import { TranslationDictionary } from '../i18n/translations';

interface GeometryCanvasProps {
  l1: LineEquation;
  l2: LineEquation;
  calcResult: CalculationResult;
  t?: TranslationDictionary;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({ l1, l2, calcResult, t }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(36); // pixels per unit
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showNormalVector, setShowNormalVector] = useState<boolean>(true);

  const width = 640;
  const height = 400;
  const centerX = width / 2 + offset.x;
  const centerY = height / 2 + offset.y;

  const toScreen = (mathX: number, mathY: number) => ({
    x: centerX + mathX * scale,
    y: centerY - mathY * scale,
  });

  const toMath = (screenX: number, screenY: number) => ({
    x: (screenX - centerX) / scale,
    y: (centerY - screenY) / scale,
  });

  // Calculate endpoints of a line Ax + By + C = 0 across the canvas
  const getLinePoints = (a: number, b: number, c: number) => {
    const minMath = toMath(0, height);
    const maxMath = toMath(width, 0);

    const xMin = minMath.x - 2;
    const xMax = maxMath.x + 2;
    const yMin = minMath.y - 2;
    const yMax = maxMath.y + 2;

    if (Math.abs(b) > 1e-6) {
      // y = (-A*x - C) / B
      const y1 = (-a * xMin - c) / b;
      const y2 = (-a * xMax - c) / b;
      return { p1: toScreen(xMin, y1), p2: toScreen(xMax, y2) };
    } else if (Math.abs(a) > 1e-6) {
      // vertical line x = -C / A
      const x = -c / a;
      return { p1: toScreen(x, yMin), p2: toScreen(x, yMax) };
    }
    return null;
  };

  const line1Points = useMemo(() => getLinePoints(l1.a, l1.b, l1.c), [l1, scale, offset]);
  const line2Points = useMemo(() => getLinePoints(l2.a, l2.b, l2.c), [l2, scale, offset]);

  const pScreen = useMemo(
    () => toScreen(calcResult.samplePointL1.x, calcResult.samplePointL1.y),
    [calcResult.samplePointL1, scale, offset]
  );
  const qScreen = useMemo(
    () => toScreen(calcResult.closestPointL2.x, calcResult.closestPointL2.y),
    [calcResult.closestPointL2, scale, offset]
  );

  // Perpendicular right angle square indicator
  const rightAnglePath = useMemo(() => {
    if (!calcResult.check.isParallel || calcResult.check.isCoincident) return null;
    const dx = qScreen.x - pScreen.x;
    const dy = qScreen.y - pScreen.y;
    const len = Math.hypot(dx, dy);
    if (len < 5) return null;

    // Unit perpendicular vector towards line direction
    const ux = dx / len;
    const uy = dy / len;
    // Orthogonal vector along l2
    const vx = -uy;
    const vy = ux;

    const s = 12; // size of right angle square
    const pA = { x: qScreen.x - ux * s, y: qScreen.y - uy * s };
    const pB = { x: pA.x + vx * s, y: pA.y + vy * s };
    const pC = { x: qScreen.x + vx * s, y: qScreen.y + vy * s };

    return `M ${pA.x} ${pA.y} L ${pB.x} ${pB.y} L ${pC.x} ${pC.y}`;
  }, [pScreen, qScreen, calcResult]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setScale(36);
    setOffset({ x: 0, y: 0 });
  };

  // Generate grid ticks
  const gridTicks = useMemo(() => {
    const ticks: { x: number; y: number; label: string; isX: boolean }[] = [];
    const minM = toMath(0, height);
    const maxM = toMath(width, 0);

    const step = scale < 20 ? 5 : scale < 40 ? 2 : 1;

    const startX = Math.floor(minM.x / step) * step;
    const endX = Math.ceil(maxM.x / step) * step;
    for (let x = startX; x <= endX; x += step) {
      if (Math.abs(x) > 1e-4) {
        ticks.push({ x, y: 0, label: `${x}`, isX: true });
      }
    }

    const startY = Math.floor(minM.y / step) * step;
    const endY = Math.ceil(maxM.y / step) * step;
    for (let y = startY; y <= endY; y += step) {
      if (Math.abs(y) > 1e-4) {
        ticks.push({ x: 0, y, label: `${y}`, isX: false });
      }
    }
    return ticks;
  }, [scale, offset]);

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            {t?.canvasTitle || '动态几何画板·解析验证'}
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {t?.canvasSubtitle || '支持拖拽漫游与缩放'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s * 1.25, 120))}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title={t?.canvasZoomIn || '放大'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(s / 1.25, 12))}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title={t?.canvasZoomOut || '缩小'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title={t?.canvasReset || '复位视图'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition flex items-center gap-1 font-semibold ${
              showGrid
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t?.canvasGrid || '网格'}
          </button>
          <button
            type="button"
            onClick={() => setShowNormalVector(!showNormalVector)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition flex items-center gap-1 font-semibold ${
              showNormalVector
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t?.canvasPerp || '垂线段'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-[360px] md:h-[400px] bg-white rounded-lg overflow-hidden border border-slate-100 cursor-grab active:cursor-grabbing select-none"
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            {/* Arrow Marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
            </marker>
            <marker id="arrow-n" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>

          {/* Coordinate Grid */}
          {showGrid && (
            <g opacity="0.6">
              {gridTicks.map((t, i) => {
                if (t.isX) {
                  const s = toScreen(t.x, 0);
                  return (
                    <line
                      key={`grid-x-${i}`}
                      x1={s.x}
                      y1={0}
                      x2={s.x}
                      y2={height}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  );
                } else {
                  const s = toScreen(0, t.y);
                  return (
                    <line
                      key={`grid-y-${i}`}
                      x1={0}
                      y1={s.y}
                      x2={width}
                      y2={s.y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  );
                }
              })}
            </g>
          )}

          {/* X Axis */}
          <line
            x1={0}
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
          <text x={width - 16} y={centerY + 16} fontSize="12" fill="#64748b" fontWeight="bold">
            x
          </text>

          {/* Y Axis */}
          <line
            x1={centerX}
            y1={height}
            x2={centerX}
            y2={0}
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
          <text x={centerX + 10} y={16} fontSize="12" fill="#64748b" fontWeight="bold">
            y
          </text>

          {/* Origin O */}
          <text x={centerX - 14} y={centerY + 14} fontSize="11" fill="#94a3b8">
            O
          </text>

          {/* Axis Ticks */}
          {gridTicks.map((t, idx) => {
            const s = toScreen(t.x, t.y);
            if (t.isX) {
              return (
                <g key={`tick-x-${idx}`}>
                  <line x1={s.x} y1={centerY - 3} x2={s.x} y2={centerY + 3} stroke="#94a3b8" strokeWidth="1" />
                  <text x={s.x} y={centerY + 14} fontSize="9" fill="#94a3b8" textAnchor="middle">
                    {t.label}
                  </text>
                </g>
              );
            } else {
              return (
                <g key={`tick-y-${idx}`}>
                  <line x1={centerX - 3} y1={s.y} x2={centerX + 3} y2={s.y} stroke="#94a3b8" strokeWidth="1" />
                  <text x={centerX - 8} y={s.y + 3} fontSize="9" fill="#94a3b8" textAnchor="end">
                    {t.label}
                  </text>
                </g>
              );
            }
          })}

          {/* Line 1 (Blue) */}
          {line1Points && (
            <g>
              <line
                x1={line1Points.p1.x}
                y1={line1Points.p1.y}
                x2={line1Points.p2.x}
                y2={line1Points.p2.y}
                stroke="#2563eb"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Line 2 (Emerald) */}
          {line2Points && (
            <g>
              <line
                x1={line2Points.p1.x}
                y1={line2Points.p1.y}
                x2={line2Points.p2.x}
                y2={line2Points.p2.y}
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray={calcResult.check.isCoincident ? '4 4' : undefined}
              />
            </g>
          )}

          {/* Perpendicular Distance Segment */}
          {calcResult.check.isParallel && !calcResult.check.isCoincident && showNormalVector && (
            <g>
              {/* Distance line segment */}
              <line
                x1={pScreen.x}
                y1={pScreen.y}
                x2={qScreen.x}
                y2={qScreen.y}
                stroke="#e11d48"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Right angle symbol */}
              {rightAnglePath && (
                <path d={rightAnglePath} fill="none" stroke="#e11d48" strokeWidth="1.2" />
              )}

              {/* Point P on L1 */}
              <circle cx={pScreen.x} cy={pScreen.y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <text x={pScreen.x + 8} y={pScreen.y - 6} fontSize="11" fill="#1e3a8a" fontWeight="bold">
                P({calcResult.samplePointL1.x.toFixed(1)}, {calcResult.samplePointL1.y.toFixed(1)})
              </text>

              {/* Point Q (perpendicular foot on L2) */}
              <circle cx={qScreen.x} cy={qScreen.y} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
              <text x={qScreen.x + 8} y={qScreen.y + 12} fontSize="11" fill="#065f46" fontWeight="bold">
                Q({calcResult.closestPointL2.x.toFixed(1)}, {calcResult.closestPointL2.y.toFixed(1)})
              </text>

              {/* Distance badge in center of segment */}
              <g transform={`translate(${(pScreen.x + qScreen.x) / 2}, ${(pScreen.y + qScreen.y) / 2})`}>
                <rect x="-36" y="-12" width="72" height="22" rx="4" fill="#ffffff" stroke="#e11d48" strokeWidth="1" />
                <text x="0" y="3" fontSize="11" fill="#e11d48" fontWeight="bold" textAnchor="middle">
                  d={calcResult.exactDistance.decimal.toFixed(2)}
                </text>
              </g>
            </g>
          )}

          {/* Intersecting point if not parallel */}
          {!calcResult.check.isParallel && calcResult.check.intersectionPoint && (
            <g>
              {(() => {
                const s = toScreen(
                  calcResult.check.intersectionPoint.x,
                  calcResult.check.intersectionPoint.y
                );
                return (
                  <>
                    <circle cx={s.x} cy={s.y} r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                    <text x={s.x + 8} y={s.y - 6} fontSize="11" fill="#dc2626" fontWeight="bold">
                      交点({calcResult.check.intersectionPoint.x.toFixed(2)},{' '}
                      {calcResult.check.intersectionPoint.y.toFixed(2)})
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Legend overlays */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-2 text-xs shadow-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" />
            <span className="font-medium text-slate-700">l₁: {l1.a}x + {l1.b}y + {l1.c} = 0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" />
            <span className="font-medium text-slate-700">l₂: {l2.a}x + {l2.b}y + {l2.c} = 0</span>
          </div>
          {calcResult.check.isParallel && (
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-slate-100 text-rose-600 font-semibold">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-rose-500 inline-block" />
              <span>垂直间距 d ≈ {calcResult.exactDistance.decimal.toFixed(4)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
