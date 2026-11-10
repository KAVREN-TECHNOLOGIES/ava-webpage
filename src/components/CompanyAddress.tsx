import { company } from "../data/company";

export function CompanyAddress({ className = "" }: { className?: string }) {
  return <address className={`company-address ${className}`.trim()}>
    <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer">
      {company.street}<br />
      {company.suite}<br />
      {company.locality}
    </a>
  </address>;
}
