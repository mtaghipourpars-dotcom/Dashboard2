import { createServerFn } from "@tanstack/react-start";
import { conveneCouncil } from "./council";
import { runSimulation } from "./simulate";
import { GOLDEN_DISRUPTION } from "./seed";
import type { PriorityProfile } from "./types";

export const interpretCouncil = createServerFn({ method: "POST" })
  .validator((input: { profile: PriorityProfile; durationDays: number }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    const sim = runSimulation(
      { ...GOLDEN_DISRUPTION, durationDays: data.durationDays },
      data.profile,
    );
    const opinions = conveneCouncil(sim);
    if (!apiKey) {
      return { ok: false as const, error: "AI_UNAVAILABLE", opinions, interpretation: null };
    }

    const payload = {
      facts: sim.facts,
      assumptions: sim.assumptions,
      calculated: sim.calculated,
      recommendation: {
        id: sim.recommendation.alternative.id,
        name: sim.recommendation.alternative.nameFa,
        score: sim.recommendation.score,
        delay: sim.recommendation.kpi.delayDays,
        cost: sim.recommendation.kpi.costIrr,
      },
      opinions: opinions.map((o) => ({
        role: o.role,
        stance: o.stance,
        thesis: o.thesisFa,
      })),
    };

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "تو لایه تفسیر شورای اجرایی مجازی Mission Control هستی. حق محاسبه عدد جدید نداری. فقط بر اساس JSON ورودی، یک جمع‌بندی فارسی کوتاه برای مدیرعامل بنویس: تعارض آرا، شرط‌ها، و اینکه انسان باید چه را تأیید کند. هیچ رقم تازه‌ای نساز.",
            },
            { role: "user", content: JSON.stringify(payload) },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: false as const, error: `xAI ${res.status}`, opinions, interpretation: null };
      }
      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      return {
        ok: true as const,
        opinions,
        interpretation: body.choices[0]?.message.content ?? "",
      };
    } catch {
      return { ok: false as const, error: "NETWORK", opinions, interpretation: null };
    }
  });
