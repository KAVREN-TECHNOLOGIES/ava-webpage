import { brandLockup } from "../data/brand";
import "./brand-logo.css";

export function BrandLogo() {
  return (
    <span className="ava-brand" aria-hidden="true">
      <svg className="ava-brand__mark" viewBox="66.9336 62.4297 115.3438 32.9648" focusable="false">
        <path d={brandLockup.letters} fill="currentColor" />
      </svg>
      <span className="ava-brand__descriptor">Cosmetic Surgery</span>
      <span className="ava-brand__city">Miami</span>
    </span>
  );
}
