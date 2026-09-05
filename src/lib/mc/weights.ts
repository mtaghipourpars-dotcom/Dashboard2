import type { PriorityProfile, PriorityWeights } from "./types";

export const PROFILE_WEIGHTS: Record<PriorityProfile, PriorityWeights> = {
  normal: {
    cash: 0.2,
    commitment: 0.25,
    margin: 0.15,
    schedule: 0.2,
    risk: 0.12,
    cost: 0.08,
  },
  cash_crisis: {
    cash: 0.4,
    commitment: 0.15,
    margin: 0.1,
    schedule: 0.1,
    risk: 0.1,
    cost: 0.15,
  },
  delivery_crisis: {
    cash: 0.1,
    commitment: 0.35,
    margin: 0.05,
    schedule: 0.3,
    risk: 0.15,
    cost: 0.05,
  },
  strategic_customer: {
    cash: 0.1,
    commitment: 0.4,
    margin: 0.1,
    schedule: 0.2,
    risk: 0.15,
    cost: 0.05,
  },
};

export const PROFILE_LABEL: Record<PriorityProfile, string> = {
  normal: "حالت عادی",
  cash_crisis: "بحران نقدینگی",
  delivery_crisis: "بحران تحویل",
  strategic_customer: "مشتری راهبردی",
};
