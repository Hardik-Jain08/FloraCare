import gsap from "gsap";

export const clearAnimatedProps = (
  target: gsap.TweenTarget,
  props?: string | string[]
) => {
  gsap.set(target, {
    clearProps: (props instanceof Array ? props.join(",") : props) ?? "all",
  });
};
