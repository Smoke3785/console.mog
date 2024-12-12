import { MogContext } from "@classes/core/MogContext/index.ts";
import { PolymorphicColor, ColorFn } from "@types";
import { resolvePolymorphicColor } from "@utils";

import chalk, { Chalk, ChalkInstance } from "chalk";

class Augmentable {
  constructor(augment: any = {}) {
    Object.assign(this, augment);
  }
  static create<T extends typeof Augmentable, U>(this: T, augment?: U) {
    return new this(augment) as InstanceType<T> & U;
  }
}

// import type { ToolkitChalk } from "./types.ts";
type CustomColorStore = Record<string, ColorFn>;

type ChalkWithColors<T extends CustomColorStore = {}> = ChalkInstance & T;

export class Toolkit<CustomColors extends CustomColorStore = {}> {
  private static instance: Toolkit;
  private customColors: CustomColors = {} as CustomColors;

  private constructor() {
    // this.customColors = {} as CustomColors;
  }

  public static getInstance(): Toolkit {
    if (!Toolkit.instance) {
      Toolkit.instance = new Toolkit();
    }

    return Toolkit.instance;
  }

  public get chalk(): ChalkWithColors<CustomColors> {
    const _chalk = chalk as ChalkWithColors<CustomColors>;

    for (const [name, color] of Object.entries(this.customColors)) {
      // @ts-ignore
      _chalk[name] = color;
    }

    return _chalk as ChalkWithColors<CustomColors>;
  }

  public addCustomStyle<K extends string, C extends PolymorphicColor>(
    name: K,
    color: C
  ): Toolkit {
    const resolvedColor = resolvePolymorphicColor(color);

    // @ts-ignore
    this.customColors[name] = resolvedColor;

    // Return 'this' casted to Toolkit with extended type
    return Augmentable.create({
      ...this,
      customColors: this.customColors,
    }) as Toolkit<CustomColors>;
  }
}

export default Toolkit;
