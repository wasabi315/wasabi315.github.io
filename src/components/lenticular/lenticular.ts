export type Direction = `horizontal` | `vertical`;
export type Option = {
  direction?: Direction;
  stripeWidth?: number;
  easingFn?: (v: number) => number;
  initialViewpoint?: number;
};

const IMAGE_SOURCES = [
  HTMLImageElement,
  HTMLPictureElement,
  HTMLCanvasElement,
] as const;
export type ImageSource = InstanceType<
  typeof IMAGE_SOURCES extends readonly (infer E)[] ? E : never
>;
export const isImageSource = (el: unknown): el is ImageSource =>
  IMAGE_SOURCES.some((ctor) => el instanceof ctor);

export interface Viewer {
  viewpoint: number;
  destroy(): void;
}

export function createViewer(
  to: HTMLCanvasElement,
  images: ImageSource[],
  option?: Option,
): Viewer {
  let srcs = images.flatMap((el) => ImageSourceWrapper.from(el) ?? []);
  const direction = option?.direction ?? `horizontal`;
  const stripeWidth = Math.max(option?.stripeWidth ?? 2, 1);
  const easingFn = (v: number) => clamp(0, option?.easingFn?.(v) ?? v, 1);
  let viewpoint = clamp(0, option?.initialViewpoint ?? 0, 1);

  const resize = (src: ImageSourceWrapper) => src.resized(to.width, to.height);

  async function draw() {
    const ctx = to.getContext(`2d`);
    if (ctx === null) {
      return;
    }

    if (srcs.length === 0) {
      return;
    }

    if (srcs.length === 1) {
      if (!(await srcs[0].waitForReady())) {
        return;
      }
      const resized = resize(srcs[0]);
      ctx.clearRect(0, 0, to.width, to.height);
      ctx.drawImage(resized, 0, 0, to.width, to.height);
      return;
    }

    const f = (srcs.length - 1) * viewpoint;
    const i = Math.min(Math.floor(f), srcs.length - 2);
    const r = easingFn(f - i);
    const w = stripeWidth * r;

    const src1 = srcs[i];
    const src2 = srcs[i + 1];
    if (!(await ImageSourceWrapper.waitForAllReady([src1, src2]))) {
      return;
    }
    const resized1 = resize(src1);
    const resized2 = resize(src2);

    ctx.clearRect(0, 0, to.width, to.height);
    switch (direction) {
      case `horizontal`:
        for (let x = 0; x < to.width; x += stripeWidth) {
          copyHorizontalStrip(ctx, resized2, x, w);
          copyHorizontalStrip(ctx, resized1, x + w, stripeWidth - w);
        }
        break;
      case `vertical`:
        for (let y = 0; y < to.height; y += stripeWidth) {
          copyVerticalStrip(ctx, resized2, y, w);
          copyVerticalStrip(ctx, resized1, y + w, stripeWidth - w);
        }
        break;
    }
  }

  draw();

  srcs.forEach((src) => {
    src.addUpdateListener(draw);
  });

  return {
    destroy() {
      srcs.forEach((src) => {
        src.removeUpdateListener(draw);
        src.destroy();
      });
      srcs = [];
    },
    get viewpoint() {
      return viewpoint;
    },
    set viewpoint(vp: number) {
      viewpoint = vp;
      draw();
    },
  };
}

abstract class ImageSourceWrapper {
  protected abstract getWidth(): number;
  protected abstract getHeight(): number;
  protected abstract getCanvasImageSource(): CanvasImageSource;
  addUpdateListener(listener: (this: ImageSourceWrapper) => unknown): void {}
  removeUpdateListener(listener: (this: ImageSourceWrapper) => unknown): void {}
  destroy() {}
  waitForReady() {
    return Promise.resolve(true);
  }

  static from(src: ImageSource): ImageSourceWrapper | null {
    if (src instanceof HTMLImageElement) {
      return ImageSourceWrapper.fromImage(src);
    }
    if (src instanceof HTMLPictureElement) {
      const image = src.querySelector(`img`);
      if (image === null) {
        console.warn(`<picture> should have <img> as a child.`);
        return null;
      }
      return ImageSourceWrapper.fromImage(image);
    }
    if (src instanceof HTMLCanvasElement) {
      return ImageSourceWrapper.fromCanvas(src);
    }
    src satisfies never;
    throw new Error(`impossible`);
  }

  static fromImage(img: HTMLImageElement): ImageSourceWrapper {
    return new (class extends ImageSourceWrapper {
      constructor() {
        super();
        img.addEventListener(`load`, this.#invokeUpdateListeners);
      }
      destroy() {
        img.removeEventListener(`load`, this.#invokeUpdateListeners);
        super.destroy();
      }

      #listeners = new Set<(this: ImageSourceWrapper) => unknown>();
      addUpdateListener(listener: (this: ImageSourceWrapper) => unknown) {
        this.#listeners.add(listener);
      }
      removeUpdateListener(listener: (this: ImageSourceWrapper) => unknown) {
        this.#listeners.delete(listener);
      }
      #invokeUpdateListeners = () => {
        this.#listeners.forEach((f) => f.call(this));
      };

      getWidth() {
        return img.naturalWidth;
      }
      getHeight() {
        return img.naturalHeight;
      }
      getCanvasImageSource() {
        return img;
      }

      waitForReady() {
        return new Promise<boolean>((resolve) => {
          if (img.complete) {
            return resolve(img.naturalWidth !== 0);
          }
          img.addEventListener(`load`, () => resolve(true), { once: true });
          img.addEventListener(`error`, () => resolve(false), { once: true });
        });
      }
    })();
  }

  static fromCanvas(canvas: HTMLCanvasElement): ImageSourceWrapper {
    return new (class extends ImageSourceWrapper {
      getWidth() {
        return canvas.width;
      }
      getHeight() {
        return canvas.height;
      }
      getCanvasImageSource() {
        return canvas;
      }
    })();
  }

  static async waitForAllReady(images: ImageSourceWrapper[]): Promise<boolean> {
    const okList = await Promise.all(
      images.map((image) => image.waitForReady()),
    );
    return okList.every((ok) => ok);
  }

  resized(width: number, height: number): CanvasImageSource {
    const imgWidth = this.getWidth();
    const imgHeight = this.getHeight();
    const zoomRatio = Math.max(width / imgWidth, height / imgHeight);
    const resizedImgWidth = width / zoomRatio;
    const resizedImgHeight = height / zoomRatio;
    const offsetX = (imgWidth - resizedImgWidth) / 2;
    const offsetY = (imgHeight - resizedImgHeight) / 2;

    const canvas = document.createElement(`canvas`);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext(`2d`)!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = `high`;
    ctx.drawImage(
      this.getCanvasImageSource(),
      offsetX,
      offsetY,
      resizedImgWidth,
      resizedImgHeight,
      0,
      0,
      width,
      height,
    );

    return canvas;
  }
}

// utils

const clamp = (min: number, v: number, max: number): number =>
  Math.max(min, Math.min(max, v));

const copyHorizontalStrip = (
  ctx: CanvasRenderingContext2D,
  s: CanvasImageSource,
  x: number,
  w: number,
) => ctx.drawImage(s, x, 0, w, ctx.canvas.height, x, 0, w, ctx.canvas.height);

const copyVerticalStrip = (
  ctx: CanvasRenderingContext2D,
  s: CanvasImageSource,
  y: number,
  w: number,
) => ctx.drawImage(s, 0, y, ctx.canvas.width, w, 0, y, ctx.canvas.width, w);
