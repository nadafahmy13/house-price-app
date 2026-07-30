import "./ValuationStamp.css";

interface ValuationStampProps {
  formattedPrice: string;
}

/**
 * A circular "appraisal seal" — the one deliberately bold element in the app,
 * echoing the ink stamps found on Indian property deeds and valuation certificates.
 */
export function ValuationStamp({ formattedPrice }: ValuationStampProps) {
  return (
    <div className="stamp" role="img" aria-label={`Appraised value: ${formattedPrice}`}>
      <svg viewBox="0 0 220 220" className="stamp__ring" aria-hidden="true">
        <defs>
          <path id="stampCirclePath" d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
        </defs>
        <circle cx="110" cy="110" r="104" className="stamp__outer" />
        <circle cx="110" cy="110" r="70" className="stamp__inner" />
        <text className="stamp__ring-text">
          <textPath href="#stampCirclePath" startOffset="2%">
            ESTIMATED MARKET VALUE &nbsp;&nbsp;•&nbsp;&nbsp; ESTIMATED MARKET VALUE &nbsp;&nbsp;•
          </textPath>
        </text>
      </svg>
      <div className="stamp__price">{formattedPrice}</div>
    </div>
  );
}
