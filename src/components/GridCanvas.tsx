import { ReactNode, RefObject, useRef, useState } from "react";
import { useOnMount } from "@/utils/lifeCycle.utils";
import { getElementBoundingBoxFromPage } from "@/utils/boundingRect.utils";
import { cx } from "linaria";
import { useStateWithRef } from "@/utils/stateWithRef.hook";
import { gsap } from "gsap";
import { isChrome } from "@/utils/browser.utils";
import { onFontReady } from "@/utils/fonts.utils";
import { clamp } from "lodash-es";
import { colorsV4 } from "@/styles/colorsV4.styles";
import { clearAnimatedProps } from "@/utils/animations.utils";
import { debounce } from "@/utils/debounce.utils";
import styled from "styled-components";

const CasesGridCanvasContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: inherit;
  overflow: hidden;
  &.fixed {
    position: fixed;
  }
  &.animateIn {
    line {
      @keyframes LineEnter {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      opacity: 0;
      animation: LineEnter 0.5s forwards;
    }
  }
`;

const HtmlChildrenLayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

type PointDef = { x: number; y: number };

type LineDef = { start: PointDef; end: PointDef; delay: number };

export type CasesGridCanvasChildren = (o: {
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
}) => ReactNode;

export const GridCanvas = (p: {
  maskId?: string;
  className?: string;
  backgroundColor?: string;
  color?: string;
  fixed?: boolean;
  parallax?: boolean;
  animateIn?: boolean;
  addBorderBottom?: boolean;
  svgChildren?: CasesGridCanvasChildren;
  htmlChildren?: CasesGridCanvasChildren;
  onReady?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibilityRef, setVisibility] = useStateWithRef(false);
  const [lines, setLines] = useState<LineDef[]>([]);
  const [canvasWidthRef, setCanvasWidth] = useStateWithRef(0);
  const [canvasHeightRef, setCanvasHeight] = useStateWithRef(0);
  const [topRef, setTop] = useStateWithRef(0);
  const [leftRef, setLeft] = useStateWithRef(0);
  const [sizeRef, setSize] = useStateWithRef(0);

  useOnMount(() => {
    let yOffset = 0;
    const calculateVisibleLineDefs = () => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, ref.current?.clientHeight ?? 0);
      const result: LineDef[] = [];
      const size = Math.min(w / (w >= 768 ? 8 : w > 480 ? 6 : 4), 180);
      setSize(size);
      const vertLines = Math.ceil(w / size);
      const firstVertLineX = (w % size) / 2;
      Array(vertLines)
        .fill(null)
        .forEach((n, i) => {
          const x =
            Math.round(firstVertLineX + i * size - leftRef.current) + 0.5;
          result.push({
            start: { x, y: 0 },
            end: { x, y: canvasHeightRef.current },
            delay: i * 0.07,
          });
        });
      const horizLines =
        Math.ceil((h + yOffset * -1 + topRef.current) / size) + 2;
      const firstHorizLineY = topRef.current * -1 - size * 0.325;
      Array(horizLines)
        .fill(null)
        .forEach((n, i) => {
          const y = Math.round(firstHorizLineY + i * size + yOffset) + 0.5;
          if (y < 0) return;
          result.push({
            start: { x: 0, y },
            end: { x: 0 + canvasWidthRef.current, y },
            delay: (i + 1) * 0.07,
          });
        });
      setLines(result);
    };
    const handleResize = () => {
      const rect = getElementBoundingBoxFromPage(ref.current!);
      setTop(rect.top);
      setLeft(rect.left);
      setCanvasWidth(ref.current?.clientWidth ?? 0);
      setCanvasHeight(ref.current?.clientHeight ?? 0);
      setTimeout(calculateVisibleLineDefs);
    };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize);
    setTimeout(handleResize, 250); // in case the first time didn't work in safari
    onFontReady(handleResize);
    const handleScroll = () => {
      if ((!p.fixed && !p.parallax) || !visibilityRef.current) return;
      yOffset =
        ((p.parallax ? window.scrollY / -5 : 0) +
          (p.fixed ? window.scrollY : 0)) *
        -1;
      calculateVisibleLineDefs();
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibility(entries[0].isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );
    observer.observe(ref.current!);
    p.onReady?.();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  });
  const maskId = `${p.maskId}-mask`;
  const color = p.color ?? colorsV4.purple300;

  return (
    <CasesGridCanvasContainer
      className={cx(
        p.className,
        p.fixed && "fixed",
        p.parallax ? "parallax" : "static",
        p.animateIn && "animateIn",
        p.addBorderBottom && "addBorderBottom"
      )}
      ref={ref}
      style={{
        backgroundColor: p.backgroundColor,
        ...(p.addBorderBottom ? { borderBottom: `1px solid ${color}` } : null),
      }}
    >
      <svg
        width={canvasWidthRef.current}
        height={canvasHeightRef.current}
        viewBox={`0 0 ${canvasWidthRef.current} ${canvasHeightRef.current}`}
        fill="none"
        data-grid-size={sizeRef.current}
      >
        {p.maskId && (
          <Mask
            id={maskId}
            containerWidthRef={canvasWidthRef}
            containerHeightRef={canvasHeightRef}
            topRef={topRef}
            leftRef={leftRef}
            color={color}
            visibilityRef={visibilityRef}
          />
        )}
        <g stroke={color} mask={p.maskId ? `url(#${maskId})` : undefined}>
          {lines.map((def, i) => (
            <line
              key={i}
              x1={def.start.x}
              y1={def.start.y}
              x2={def.end.x}
              y2={def.end.y}
              style={{
                animationDelay: p.parallax ? undefined : `${def.delay}s`,
              }}
            />
          ))}
          {p.svgChildren?.({
            gridSize: sizeRef.current,
            canvasWidth: canvasWidthRef.current,
            canvasHeight: canvasHeightRef.current,
          })}
        </g>
      </svg>
      {p.htmlChildren ? (
        <HtmlChildrenLayer>
          {p.htmlChildren?.({
            gridSize: sizeRef.current,
            canvasWidth: canvasWidthRef.current,
            canvasHeight: canvasHeightRef.current,
          })}
        </HtmlChildrenLayer>
      ) : null}
    </CasesGridCanvasContainer>
  );
};

const Mask = (p: {
  id: string;
  color: string;
  containerWidthRef: RefObject<number>;
  containerHeightRef: RefObject<number>;
  topRef: RefObject<number>;
  leftRef: RefObject<number>;
  visibilityRef: RefObject<boolean>;
}) => {
  const [ready, setReady] = useState(false);

  const maskCircleRef = useRef<SVGCircleElement>(null);
  const outlinedCircleRef = useRef<SVGCircleElement>(null);

  const [vwRef, setVw] = useStateWithRef(0);
  const [vhRef, setVh] = useStateWithRef(0);
  const [pageXRef, setPageX] = useStateWithRef(0);
  const [pageYRef, setPageY] = useStateWithRef(0);

  const baseValuesRef = useRef({
    get x() {
      return p.containerWidthRef.current! / 2;
    },
    get y() {
      return p.containerHeightRef.current! / 2 - p.topRef.current! + 92;
    },
    get r() {
      return clamp(p.containerWidthRef.current! / 2.5, 168, 230);
    },
    rotate: 105,
    skewX: 30,
  });

  const transformsRef = useRef({
    get x() {
      return pageXRef.current - vwRef.current / 2;
    },
    get y() {
      return (
        pageYRef.current - vhRef.current / 2 - (vhRef.current > 768 ? 20 : 52)
      );
    },
    get scale() {
      return (
        1 +
        Math.max(
          0,
          (1 -
            Math.abs(transformsRef.current.x + transformsRef.current.y) /
              (p.containerWidthRef.current! + p.containerHeightRef.current!)) *
            0.5
        )
      );
    },
    get rotate() {
      return pageXRef.current / 100 + pageYRef.current / 100;
    },
    get skewX() {
      return 0;
    },
  });

  const transformedValuesRef = useRef({
    get r() {
      return baseValuesRef.current.r * transformsRef.current.scale;
    },
    get skewX() {
      return baseValuesRef.current.skewX + transformsRef.current.skewX;
    },
    get rotate() {
      return baseValuesRef.current.rotate + transformsRef.current.rotate;
    },
  });

  useOnMount(() => {
    setPageX(window.innerWidth / 2);
    setPageY(window.innerHeight / 2);
    const measureViewport = () => {
      const prev = {
        vw: vwRef.current,
        vh: vhRef.current,
      };
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      return {
        prev,
        curr: {
          vw: window.innerWidth,
          vh: window.innerHeight,
        },
      };
    };
    measureViewport();
    const circles = [maskCircleRef.current, outlinedCircleRef.current];
    const enter = () => {
      gsap.set(circles, {
        r: 1,
        x: baseValuesRef.current.x,
        y: baseValuesRef.current.y + 250,
        skewX: 0,
        rotate: 0,
      });
      gsap.fromTo(
        circles,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.1,
          onComplete: () => {
            setReady(true);
            gsap.to(circles, {
              x: transformsRef.current.x,
              y: transformsRef.current.y,
              r: transformedValuesRef.current.r,
              skewX: transformedValuesRef.current.skewX,
              rotate: transformedValuesRef.current.rotate,
              transformOrigin: "50% 50%",
              ease: "power2.out",
              duration: 1.38,
            });
          },
        }
      );
    };
    const animate = () => {
      if (!p.visibilityRef.current) return;
      gsap.to(circles, {
        x: transformsRef.current.x,
        y: transformsRef.current.y,
        r: transformedValuesRef.current.r,
        skewX: transformedValuesRef.current.skewX,
        rotate: transformedValuesRef.current.rotate,
        transformOrigin: "50% 50%",
        ease: "power2.out",
      });
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { pageX, pageY } = e;
      setPageX(pageX);
      setPageY(pageY);
      animate();
    };
    const handleTouchStart = (e: TouchEvent) => {
      const { pageX, pageY } = e.touches[0];
      setPageX(pageX);
      setPageY(pageY);
      setTimeout(animate);
    };
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0) return;
      setPageY(pageYRef.current + e.deltaY * (isChrome() ? 0.5 : 1));
      animate();
    };
    const reset = debounce(() => {
      clearAnimatedProps(circles, ["x", "y"]);
      setPageX(window.innerWidth / 2);
      setPageY(window.innerHeight / 2);
      enter();
    });
    const handleResize = () => {
      const { prev, curr } = measureViewport();
      if (prev.vw !== curr.vw) reset();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("wheel", handleWheel);
    setTimeout(enter);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("wheel", handleWheel);
    };
  });

  return (
    <>
      <mask id={p.id}>
        <rect
          width={p.containerWidthRef.current!}
          height={p.containerHeightRef.current!}
          fill="white"
        />
        <circle
          cx={baseValuesRef.current.x}
          cy={baseValuesRef.current.y}
          r={baseValuesRef.current.r}
          fill="black"
          ref={maskCircleRef}
          fillOpacity={ready ? 1 : 0}
        />
      </mask>
      <circle
        cx={baseValuesRef.current.x}
        cy={baseValuesRef.current.y}
        r={baseValuesRef.current.r}
        ref={outlinedCircleRef}
        stroke={p.color}
        strokeOpacity={ready ? 1 : 0}
      />
    </>
  );
};
