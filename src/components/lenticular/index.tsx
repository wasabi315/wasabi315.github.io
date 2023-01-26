import * as React from "react";

import * as Lenti from "./lenticular";

type Props = React.ComponentPropsWithoutRef<`canvas`> &
  Lenti.Option & {
    alt?: string;
    children: React.ReactNode | React.ReactNode[];
  };

type Handle = {
  setViewpoint(vp: number): void;
};

const Lenticular = React.forwardRef<Handle, Props>(function Lenticular(
  {
    alt,
    direction,
    stripeWidth,
    easingFn,
    initialViewpoint,
    children,
    ...props
  },
  ref,
) {
  const imageContainer = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const viewer = React.useRef<Lenti.Viewer | null>(null);

  React.useEffect(() => {
    if (canvas.current === null || imageContainer.current === null) {
      return;
    }
    const images = [...imageContainer.current.children].filter(
      Lenti.isImageSource,
    );
    const v = Lenti.createViewer(canvas.current, images, {
      direction,
      stripeWidth,
      easingFn,
      initialViewpoint,
    });
    viewer.current = v;
    return () => {
      v.destroy();
    };
  }, [children, stripeWidth, easingFn, initialViewpoint]);

  React.useImperativeHandle(ref, () => ({
    setViewpoint(vp: number) {
      if (viewer.current) {
        viewer.current.viewpoint = vp;
      }
    },
  }));

  return (
    <>
      <div ref={imageContainer} style={{ display: `none` }} aria-hidden>
        {children}
      </div>
      <canvas ref={canvas} {...props} role="img" aria-label={alt}>
        {alt}
      </canvas>
    </>
  );
});

export default Lenticular;

export function useLenticular(): [
  React.FC<Props>,
  (viewpoint: number) => void,
] {
  const ref = React.useRef<Handle>(null);
  const setViewpoint = React.useCallback((vp: number) => {
    ref.current?.setViewpoint(vp);
  }, []);

  const LenticularWrapper = React.useCallback(function LenticularWrapper(
    props: Props,
  ) {
    return <Lenticular ref={ref} {...props} />;
  },
  []);

  return [LenticularWrapper, setViewpoint];
}
