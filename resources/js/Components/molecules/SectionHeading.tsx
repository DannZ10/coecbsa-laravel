import { Kicker } from "@/Components/atoms/Kicker";
import { Reveal } from "@/Components/atoms/Reveal";

type Props = {
  no?: string;
  kicker: string;
  title: string;
  lead?: string;
  tone?: "forest" | "paper";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({ no, kicker, title, lead, tone = "forest", align = "left", className = "", titleClassName = "" }: Props) {
  const dark = tone === "paper";
  return (
    <div
      className={`flex max-w-2xl flex-col gap-4 ${align === "center" ? "mx-auto items-center text-center" : ""} ${className}`}
    >
      <Reveal>
        <Kicker no={no} tone={dark ? "paper" : "forest"}>
          {kicker}
        </Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className={`font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-[2.6rem] ${dark ? "text-paper" : "text-forest-900"} ${titleClassName}`}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className={`text-base leading-relaxed ${dark ? "text-forest-300" : "text-muted-foreground"}`}>
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
