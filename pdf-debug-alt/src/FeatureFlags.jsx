import { FEATURES } from "../config";

export default function FeatureFlags({ children, feature }) {
  return FEATURES[feature] ? children : null;
}
